// ----- Ember modules -----
import Service from 'ember-service'
import {assert} from 'ember-metal/utils'
import getOwner from 'ember-owner/get'
import computed from 'ember-computed'
// import get from 'ember-metal/get'
// import {A} from 'ember-array/utils'
// import on from 'ember-evented/on'

// ----- Third-party libraries -----
import RSVP from 'rsvp'

// ----- Own modules -----
import Node      from 'ember-zen/node'
import NodeArray from 'ember-zen/node-array'



export default Service.extend({

  // ----- Computed properties -----
  owner : computed(function () { return getOwner(this) }),



  // ----- Overridden methods -----



  // ----- Public methods -----
  dispatch (nodeOrPath, message, callback, params) {
    const node = this._getNode(nodeOrPath)

    if (node.get('isDestroying') || node.get('isDestroyed')) return

    node.set('_isDispatchInProgress', true)
    callback()
    this.logStateChangeOnNode(node, message, params)
    node.set('_isDispatchInProgress', false)
  },



  dispatchAction (nodeOrPath, actionName, ...args) {
    const node    = this._getNode(nodeOrPath)
    const message = `action "${actionName}"`
    const action  = () => node.send(actionName, ...args)

    this.dispatch(nodeOrPath, message, action, {actionName, args})
  },



  dispatchSet (nodeOrPath, message, key, value) {
    const node = this._getNode(nodeOrPath)
    message = message || `set \`${key}\``

    assert(
      `Attempted to dispatchSet ${key} on ${node.get('nodeName')}, but ${key} is not an attribute on ${node.get('nodeName')}`,
      node._hasAttr(key)
    )

    const action  = () => node._setAttr(key, value)

    this.dispatch(node, message, action, {key, value})
  },



  dispatchSetProperties (nodeOrPath, message, obj) {
    const node = this._getNode(nodeOrPath)
    const keys = Object.keys(obj)

    keys.forEach(key => {
      assert(
        `Attempted to dispatchSetProperties ${key} on ${node.get('nodeName')}, but ${key} is not an attribute on ${node.get('nodeName')}`,
        node._hasAttr(key)
      )
    })

    message = message || "set `" + keys.join("`, `") + "`"
    const action  = () => node._setAttrs(obj)

    this.dispatch(node, message, action, {obj})
  },

  dispatchPromise (nodeOrPath, name, callback) {
    const node = this._getNode(nodeOrPath)

    const keyIsPending   = `${name}IsPending`
    const keyIsRejected  = `${name}IsRejected`
    const keyIsFulfilled = `${name}IsFulfilled`
    const keyIsSettled   = `${name}IsSettled`
    const keyResponse    = `${name}Response`
    const keyError       = `${name}Error`
    const keyPromise     = `${name}Promise`

    const isPending = node.get(keyIsPending)

    if (isPending) throw new Error(`Can't dispatch promise ${name} on node ${node.get('nodePath')} as it's already pending`)

    this.dispatchSetProperties(node, `starting promise "${name}"`, {
      [keyIsPending]   : true,
      [keyIsRejected]  : false,
      [keyIsFulfilled] : false,
      [keyIsSettled]   : false,
    })

    const promise = callback()

      .then(response => {
        this.dispatchSetProperties(node, `fulfilling promise "${name}"`, {
          [keyIsPending]   : false,
          [keyIsRejected]  : false,
          [keyIsFulfilled] : true,
          [keyIsSettled]   : true,
          [keyResponse]    : response,
          [keyError]       : null,
        })

        return response
      })

      .catch(error => {
        this.dispatchSetProperties(node, `rejecting promise "${name}"`, {
          [keyIsPending]   : false,
          [keyIsRejected]  : true,
          [keyIsFulfilled] : false,
          [keyIsSettled]   : true,
          [keyResponse]    : null,
          [keyError]       : error,
        })

        return RSVP.reject(error)
      })

    this.set(keyPromise, promise)

    return promise
  },



  createNode (nodeTypeName, props) {
    const newNode = this._lookupNodeType(nodeTypeName)

    assert(`Expecting instance of a Node or NodeArray (sub)class`,
      newNode instanceof Node
      || newNode instanceof NodeArray
    )

    if (props) newNode.setProperties(props)

    return newNode
  },



  logStateChangeOnNode (nodeOrPath, message, params = {}) {
    // debugger
    const node     = this._getNode(nodeOrPath)
    const nodePath = node.get('nodePath')

    message = `[zen] ${nodePath}: ${message}`

    const result = {
      node,
      nodePath,
      nodeName     : node.get('nodeName'),
      nodeSnapshot : node.valueOf(),
      stackTrace   : this.captureStackTrace(),
      ...params,
    }

    const rootNode = node.get('rootNode')
    if (node !== rootNode) {
      const rootNodeName = rootNode.get('nodeName')

      result.rootNode         = rootNode
      result.rootNodeName     = rootNodeName
      result.rootNodeSnapshot = rootNode.valueOf()
    }

    console.info(message, result)
  },




  restore (node, snapshot) {
    return node.restore(snapshot)
  },



  captureStackTrace () {
    // https://github.com/chaijs/assertion-error/blob/48599d08c8aeaebc048939f6bf4ff732cd74a093/index.js#L68-L79
    const obj = {}

    if (Error.captureStackTrace) {
      Error.captureStackTrace(obj)
    } else {
      try {
        throw new Error()
      } catch (e) {
        obj.stack = e.stack
      }
    }

    return obj.stack
  },




  // ----- Private methods -----
  _getNode (nodeOrPath) {
    if (nodeOrPath instanceof Node || nodeOrPath instanceof NodeArray) return nodeOrPath

    assert(`Must be either node or path to node, "${nodeOrPath}" given`, typeof nodeOrPath === 'string')

    const node = this.get(nodeOrPath)

    assert(`Node not found: "${nodeOrPath}"`, node)

    assert(
      'Node must be an instance of Node or NodeArray',
      node instanceof Node || node instanceof NodeArray
    )

    return node
  },

  _lookupNodeType (nodeTypeName) {
    const owner      = this.get('owner')
    const moduleName = `node:${nodeTypeName}`
    const node       = owner.lookup(moduleName)

    assert(`Node class not found: "${nodeTypeName}"`, node)

    return node
  },

})
