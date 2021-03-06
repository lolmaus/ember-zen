// ----- Ember modules -----
import Mixin from 'ember-metal/mixin'
import service from 'ember-service/inject'
import {assert} from 'ember-metal/utils'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'



export default Mixin.create({

  // ----- Overridable properties -----
  parent : undefined,



  // ----- Services -----
  zen : service(),



  // ----- Computed properties -----
  nodeName : computed(function () {
    const step1 =  this.toString().split('@')[1]
    if (!step1) return "<unknown node>"

    const step2 = step1.split(':')[1]
    return step2 || "<unknown node>"
  }),

  nodePath : computed(
    'nodeName', 'parent.nodeName',
    (nodeName,   parentName) => {
      return parentName
        ? `${parentName}.${nodeName}`
        : nodeName
    }
  ),

  rootNode : computed('parent', function (parent) {
    let node = this
    while (parent = node.get('parent')) node = parent // eslint-disable-line no-cond-assign
    return node
  }),



  // ----- Overridden properties -----
  concatenatedProperties : ['_reservedAttrNames'],
  mergedProperties       : ['actions', 'attrs'],



  // ----- Private properties -----
  __isZenNode__ : true,

  _isDispatchInProgress : false,

  _reservedAttrNames : [
    '__isZenNode__',
    'actions',
    'nodeName',
    'nodePath',
    'parent',
    'rootNode',
    'zen',

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



  // ----- Overridden Methods -----



  // ----- Public methods -----
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

  dispatchPromise (name, callback) {
    return this
      .get('zen')
      .dispatchPromise(this, name, callback)
  },

  send (actionName, ...args) {
    assert('Action name must be a string', typeof actionName === 'string')
    const action = this.actions[actionName]
    assert(`Attempted to call ${actionName} on node ${this.get('nodeName')}, but action of that name does not exist`, action != null)
    assert(`Attempted to call ${actionName} on node ${this.get('nodeName')}, but action of that name is not a function`, typeof action === 'function')

    return action.apply(this, args)
  },

  valueOf () {
    assert('A custom Node subclass must implement `valueOf`', false)
  },

  createChildNode (nodeTypeName, payload) {
    const node = this.get('zen').createNode(nodeTypeName, {parent : this})
    if (payload) node.populate(payload)
    return node
  },


  // ----- Private methods -----
  _returnWithValueOf (value) {
    return (value && (typeof value.valueOf === 'function'))
      ? value.valueOf()
      : value
  },
})
