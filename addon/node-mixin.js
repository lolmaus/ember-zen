// ----- Ember modules -----
import Mixin from 'ember-metal/mixin'
import service from 'ember-service/inject'
import computed from 'ember-computed'
import {assert} from 'ember-metal/utils'
import on from 'ember-evented/on'
import {getProperties} from 'ember-metal/get'



export default Mixin.create({

  // ----- Overridable properties -----
  attrNames : [],
  parent    : undefined,



  // ----- Services -----
  shelf : service(),



  // ----- Computed properties -----
  nodeName : computed(function () {
    const step1 =  this.constructor.toString().split('@')[1]
    if (!step1) return ""

    const step2 = step1.split(':')[1]
    if (!step2) return ""

    return step2
  }),



  // ----- Overridden properties -----
  concatenatedProperties : ['attrNames'],
  mergedProperties       : ['actions'],



  // ----- Private properties -----
  _forbiddenAttrNames : [
    'actions',
    'attrNames',
    'nodeName',
    'parent',
    'shelf',

    '_lazyInjections',
    '_onLookup',
    '_scheduledDestroy',
    'addObserver',
    'beginPropertyChanges',
    'cacheFor',
    'create',
    'decrementProperty',
    'destroy',
    'eachComputedProperty',
    'endPropertyChanges',
    'extend',
    'get',
    'getProperties',
    'getWithDefault',
    'hasObserverFor',
    'incrementProperty',
    'init',
    'metaForProperty',
    'notifyPropertyChange',
    'propertyDidChange',
    'propertyWillChange',
    'removeObserver',
    'reopen',
    'reopenClass',
    'set',
    'setProperties',
    'toString',
    'toggleProperty',
    'willDestroy',
    'concatenatedProperties',
    'isDestroyed',
    'isDestroying',
    'mergedProperties',
  ],



  // ----- Public methods -----
  dispatch (...args) {
    return this
      .get('shelf')
      .dispatch(this, ...args)
  },

  valueOf () {
    assert('A custom Node subclass must implement `valueOf`', false)
  },

  createChildNode (nodeTypeName, payload = {}) {
    const node      = this.get('shelf').createNode(nodeTypeName, {parent : this})
    const attrNames = node.get('attrNames')
    const attrs     = getProperties(payload, attrNames)

    node.setProperties(attrs)
    return node
  },



  // ----- Private methods -----
  _returnWithValueOf (value) {
    return (value && (typeof value.valueOf === 'function'))
      ? value.valueOf()
      : value
  },



  // ----- Events and observers -----
  _assertAllowedAttrNames : on('init', function () {
    const forbiddenKeys = this.get('_forbiddenAttrNames')
    const attrNames     = this.get('attrNames')

    assert("attrNames must be an array", attrNames instanceof Array)

    attrNames.forEach(key => {
      assert(`"${key}" is a forbidden key on a node, please use a different one`, forbiddenKeys.indexOf(key) === -1)
    })
  })
})
