// ----- Ember modules -----
import { assert } from "@ember/debug"
import {readOnly} from '@ember/object/computed'
import EmberObject, {get/*, getProperties*/} from '@ember/object'
// import {assert} from '@ember/debug'
import { guidFor } from '@ember/object/internals'
// import { on } from '@ember/object/evented'
import { getOwner } from "@ember/application"

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import {ATTR_KEY, GUID_KEY/*, NAME_KEY*/} from './constants'
import {returnValueOrValue} from './utils/return-value-or-value'

// ----- Old-school imports -----
import Ember from 'ember'
const {defineProperty} = Ember



const ContentObject = EmberObject.extend({
  _node : undefined,

  unknownProperty (key) {
    key = `_node.${key}`
    return this.get(key)
  },
})



export default EmberObject.extend({

  // ----- Overridden properties -----
  mergedProperties : ['attrs', 'actions'],



  // ----- Overridable properties -----
  attrs    : {},
  nodeName : undefined,
  nodeType : undefined,



  // ----- Computed properties -----
  owner : computed(function () { return getOwner(this) }).readOnly(),

  nodePath : computed(
    'nodeName', 'parent.nodeName',
    (nodeName,   parentName) => {
      return parentName
        ? `${parentName}.${nodeName}`
        : nodeName
    }
  ).readOnly(),

  rootNode : computed('parent.rootNode', function (rootNode) {
    return rootNode || this
  }).readOnly(),

  isDispatchInProgress : computed(
    '_isDispatchInProgress', 'parent.isDispatchInProgress',
    (selfInProgress,          parentInProgress) => {
      return selfInProgress || parentInProgress
    }
  ).readOnly(),


  // ----- Overridden methods -----
  init () {
    this._resetAttrs()
  },



  // ----- Public methods -----
  setAttr (key, value) {
    this._assertDispatch()
    this._setAttr(key, value)
  },

  setAttrs (obj) {
    this._assertDispatch()
    this._setAttrs(obj)
  },

  dispatch (...args) {
    return this
      .get('zen')
      .dispatch(this, ...args)
  },

  dispatchAction (...args) {
    return this
      .get('zen')
      .dispatchAction(this, ...args)
  },

  dispatchSet (message, key, value) {
    return this
      .get('zen')
      .dispatchSet(this, message, key, value)
  },

  dispatchSetProperties (message, obj) {
    return this
      .get('zen')
      .dispatchSetProperties(this, message, obj)
  },

  createChildNode ({nodeName, nodeType, payload}) {
    const node = this.get('zen').createNode({nodeName, nodeType, parent : this})
    if (payload) node._setAttrs(payload)
    return node
  },

  send (actionName, ...args) {
    assert('Action name must be a string', typeof actionName === 'string')
    const action = this.actions[actionName]
    assert(`Attempted to call ${actionName} on node ${this.get('nodeName')}, but action of that name does not exist`, action != null)
    assert(`Attempted to call ${actionName} on node ${this.get('nodeName')}, but action of that name is not a function`, typeof action === 'function')

    return action.apply(this, args)
  },

  serialize () {
    return Object
      .keys(this.attrs)
      .reduce((result, key) => {
        const attrDef = this.attrs[key]
        const value = this.get('value')

        if (attrDef && attrDef[ATTR_KEY]) {
          const attrClass = this._getAttrClass(attrDef.type)
          result[key] = attrClass.serialize(value, {...attrDef, key})
        } else {
          result[key] = value
        }

        return result
      }, {
        [GUID_KEY] : guidFor(this),
      })
  },



  // ----- Private properties -----
  _isDispatchInProgress : false,

  _content : computed(function () {
    return ContentObject.create({_node : this})
  }).readOnly(),



  // ----- Private methods -----
  _setAttr (key, value) {
    const internalKey = this._getInternalAttrName(key)
    this.set(internalKey, value)
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
    const content = this.get('_content')
    defineProperty(content, key, undefined, value)

    const internalKey = this._getInternalAttrName(key)
    defineProperty(this, key, readOnly(internalKey))
  },

  _resetAttrs () {
    Object
      .keys(this.attrs)
      .forEach(key => {
        let value = this.attrs[key]

        if (value && value[ATTR_KEY]) {
          value = this._getInitialValueForAttr(key, value)
        }

        this._createAttr(key, value)
      })
  },

  _getInitialValueForAttr (key, options) {
    const attrClass = this._getAttrClass(options.type)

    if (options.hasOwnProperty('initialValue')) {
      const initialValue = returnValueOrValue(options.initialValue, this)
      this._assertValueType(attrClass, key, initialValue, options)
      return initialValue
    } else {
      return attrClass.getInitialValue({...options, key}, this)
    }
  },

  _getAttrClass (key) {
    const owner      = this.get('owner')
    const moduleName = `zen-attr:${key}`
    const attrClass   = owner.lookup(moduleName)

    assert(`Attr type class not found: "${key}"`, attrClass)

    return attrClass
  },

  _assertAttrPresence (key) {
    const attrs = this.attrs
    const nodePath = this.get('nodePath')

    assert(
      `\`attrs\` must be an object, but on node \`${nodePath}\` it isn't.`,
      attrs !== null && typeof attrs === 'object' && typeof attrs.hasOwnProperty === 'function'
    )

    assert(
      `Attempted to access attr \`${key}\` on node \`${nodePath}\`, but such attr is not defined on the node.`,
      attrs.hasOwnProperty(key)
    )
  },

  _assertValueType (attrClass, key, value, options) {
    if (typeof attrClass === 'string') attrClass = this._getAttrClass(attrClass)
    const nodePath = this.get('nodePath')

    assert(
      `Attr \`${key}\` type mismatch on node ${nodePath}`,
      attrClass.doesMatchType(value, options)
    )
  },

  _assertDispatch () {
    const isDispatchInProgress = this.get('isDispatchInProgress')
    const nodePath = this.get('nodePath')
    assert(
      `Setting attributes outside dispatch is not allowed, happened on node \`${nodePath}\``,
      isDispatchInProgress
    )
  },

  _getInternalAttrName (key) {
    this._assertAttrPresence(key)
    return `_content.${key}`
  },
})
