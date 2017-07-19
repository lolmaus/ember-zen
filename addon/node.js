// ----- Ember modules -----
import EmberObject from 'ember-object'
import NodeMixin from 'ember-zen/node-mixin'
import {assert, guidFor} from 'ember-metal/utils'
import {getProperties} from 'ember-metal/get'
import on from 'ember-evented/on'
import {A} from 'ember-array/utils'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import {GUID_KEY, NAME_KEY, ATTR_KEY} from 'ember-zen/constants'

// ----- Old-school Ember imports -----
import Ember from 'ember'
const {ComputedProperty} = Ember



export default EmberObject.extend(NodeMixin, {

  // ----- Overridable properties -----
  attrs : undefined,


  // ----- Computed properties -----
  _attrKeys : computed(() => A()),



  // ----- Public methods -----
  valueOf () {
    const keys = this.get('_attrKeys')

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
    const keys  = this.get('_attrKeys')
    const attrs = getProperties(payload, keys)

    this.setProperties(attrs)
  },


  createAndSetChildNode (propName, nodeTypeName, payload) {
    const childNode = this.createChildNode(nodeTypeName, payload)
    this.set(propName, childNode)
    return childNode
  },

  restore (snapshot) {
    this.get('_attrKeys').forEach(key => {
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



  // ----- Events and observers -----
  resetAttrs : on('init', function () {
    const reservedKeys = this.get('_reservedAttrNames')
    const attrs         = this.get('attrs')
    const attrKeys      = this.get('_attrKeys')

    const obj = EmberObject.extend(attrs).create()

    Object
      .keys(attrs)
      .forEach(key => {
        assert(`"${key}" is a reserved key on a node, please use a different one`, reservedKeys.indexOf(key) === -1)

        const value = obj[key]

        if (value && value[ATTR_KEY]) {
          obj.get(key).call(this)
        } else {
          attrKeys.addObject(key)
          this.set(key, value)
        }
      })
  }),


  // ----- Private properties -----
  _reservedAttrNames : [
    'attrs',
    '_attrKeys',
    'valueOf',
    'populate',
    'createAndSetChildNode',
    'restore',
  ],
})
