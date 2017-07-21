// ----- Ember modules -----
import {readOnly} from 'ember-computed'
import EmberObject from 'ember-object'
import NodeMixin from 'ember-zen/node-mixin'
import {assert, guidFor} from 'ember-metal/utils'
import get, {getProperties} from 'ember-metal/get'
import on from 'ember-evented/on'
// import {A} from 'ember-array/utils'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import {GUID_KEY, NAME_KEY, ATTR_KEY} from 'ember-zen/constants'

// ----- Old-school Ember imports -----
import Ember from 'ember'
const {ComputedProperty, defineProperty} = Ember



export default EmberObject.extend(NodeMixin, {

  // ----- Overridable properties -----
  attrs : undefined,


  // ----- Computed properties -----
  _content : computed(() => EmberObject.create()),
  _keys    : computed('_content', (content) => Object.keys(content)).volatile(),



  // ----- Public methods -----
  valueOf () {
    const keys = this.get('_keys')

    const snapshot =
      keys.reduce((result, key) => {
        const value = this.get(key)
        result[key] = this._returnWithValueOf(value)
        return result
      }, {})

    snapshot[GUID_KEY] = guidFor(this)
    snapshot[NAME_KEY] = this.get('nodeName')

    return snapshot
  },

  populate (payload) {
    const keys  = this.get('_keys')
    const attrs = getProperties(payload, keys)

    this.setProperties(attrs)
  },


  createAndSetChildNode (propName, nodeTypeName, payload) {
    const childNode = this.createChildNode(nodeTypeName, payload)
    this.set(propName, childNode)
    return childNode
  },

  restore (snapshot) {
    this.get('_keys').forEach(key => {
      // Skip read-only or CPs with dependent keys and no setter
      if (
        this[key] instanceof ComputedProperty
          && (
            (
              this[key]._dependentKeys
              && this[key]._dependentKeys.length
              && !(typeof this[key]._setter === "function")
            )
            || this[key]._readOnly
          )
      ) return

      const attrSnapshot = snapshot[key]
      const attrNodeName = attrSnapshot && attrSnapshot[NAME_KEY]

      // If attribute is not a node, just set it and carry on
      if (!attrNodeName) {
        this.set(key, attrSnapshot)
        return
      }

      let node = this.get(key)

      if (!node || attrNodeName !== node.get('nodeName')) {
        node = this.createAndSetChildNode(key, attrNodeName)
      }

      node.restore(attrSnapshot)

      return this
    })
  },

  setAttr (key, value) {
    const _isDispatchInProgress = this.get('_isDispatchInProgress')
    assert(`Setting attributes outside dispatch is not allowed, attempted to set ${key}`, _isDispatchInProgress)

    this._setAttr(key, value)
  },

  setAttrs (obj) {
    const _isDispatchInProgress = this.get('_isDispatchInProgress')
    assert(`Setting attributes outside dispatch is not allowed, attempted to set ${Object.keys(obj)}`, _isDispatchInProgress)

    this._setAttrs(obj)
  },



  // ----- Private properties -----
  _reservedAttrNames : [
    'attrs',
    '_keys',
    'valueOf',
    'populate',
    'createAndSetChildNode',
    'restore',
  ],



  // ----- Private methods -----
  _assertReservedAttr (key) {
    const reservedKeys = this.get('_reservedAttrNames')
    assert(`"${key}" is a reserved key on a node, please use a different one`, reservedKeys.indexOf(key) === -1)
  },

  _setAttr (key, value) {
    this._assertReservedAttr(key)

    const content = this.get('_content')
    content.set(key, value)
  },

  _setAttrs (obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = get(obj, key)
        this._setAttr(key, value)
      })

  },

  _createAttr (key, value) {
    this._assertReservedAttr(key)

    const content = this.get('_content')
    defineProperty(content, key, undefined, value)

    const contentKey = `_content.${key}`
    defineProperty(this, key, readOnly(contentKey))
  },

  _createAttrs (obj) {
    Object
      .keys(obj)
      .forEach(key => {
        const value = get(obj, key)
        this._createAttr(key, value)
      })
  },

  _hasAttr (key) {
    const keys = this.get('_keys')
    return keys.indexOf(key) > -1
  },



  // ----- Events and observers -----
  _resetAttrs : on('init', function () {
    const attrs = this.get('attrs')

    const obj = EmberObject.extend(attrs).create()

    Object
      .keys(attrs)
      .forEach(key => {
        const value = obj[key]

        if (value && value[ATTR_KEY]) {
          obj.get(key).call(this)
        } else {
          this._createAttr(key, value)
        }
      })
  }),
})
