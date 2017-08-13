// ----- Ember modules -----
import Service from "@ember/service"
import { assert } from "@ember/debug"
import { getOwner } from "@ember/application"

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Third-party libraries -----
import RSVP from 'rsvp'

// ----- Own modules -----
import Node from 'ember-zen/node'



export default Service.extend({

  // ----- Computed properties -----
  owner : computed(function () { return getOwner(this) }),



  // ----- Overridden methods -----



  // ----- Public methods -----
  dispatch (nodeOrPath, message, callback, params) {
    const node = this._getNode(nodeOrPath)

    if (node.get('isDestroying') || node.get('isDestroyed')) return

    node.set('_isDispatchInProgress', true)
    const result = callback()
    this.logStateChangeOnNode(node, message, params)
    node.set('_isDispatchInProgress', false)

    return result
  },



  dispatchAction (nodeOrPath, actionName, ...args) {
    const node    = this._getNode(nodeOrPath)
    const message = `action "${actionName}"`
    const action  = () => node.send(actionName, ...args)

    return this.dispatch(nodeOrPath, message, action, {actionName, args})
  },



  dispatchSet (nodeOrPath, message, key, value) {
    const node = this._getNode(nodeOrPath)
    message = message || `set \`${key}\``

    const action  = () => node._setAttr(key, value)

    return this.dispatch(node, message, action, {key, value})
  },



  dispatchSetProperties (nodeOrPath, message, obj) {
    const node = this._getNode(nodeOrPath)
    const keys = Object.keys(obj)

    message = message || "set `" + keys.join("`, `") + "`"
    const action  = () => node._setAttrs(obj)

    return this.dispatch(node, message, action, {obj})
  },



  createNode ({nodeName, nodeType, parent}) {
    const newNode = this._lookupNodeType(nodeType)

    assert(`Expecting instance of a Zen Node`, newNode instanceof Node)

    newNode.setProperties({nodeName, nodeType, parent})

    return newNode
  },



  logStateChangeOnNode (nodeOrPath, message, params = {}) {
    const node     = this._getNode(nodeOrPath)
    const nodePath = node.get('nodePath')

    message = `[zen] ${nodePath}: ${message}`

    const result = {
      node,
      nodePath,
      nodeName     : node.get('nodeName'),
      nodeSnapshot : node.serialize(),
      stackTrace   : this.captureStackTrace(),
      ...params,
    }

    const rootNode = node.get('rootNode')
    if (node !== rootNode) {
      const rootNodeName = rootNode.get('nodeName')

      result.rootNode         = rootNode
      result.rootNodeName     = rootNodeName
      result.rootNodeSnapshot = rootNode.serialize()
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
    if (nodeOrPath instanceof Node) return nodeOrPath

    assert(`Must be either node or path to node, "${nodeOrPath}" given`, typeof nodeOrPath === 'string')

    const node = this.get(nodeOrPath)

    assert(`Node not found: "${nodeOrPath}"`, node)

    assert('Node must be an instance of Zen Node', node instanceof Node)

    return node
  },

  _lookupNodeType (nodeTypeName) {
    const owner      = this.get('owner')
    const moduleName = `zen-node:${nodeTypeName}`
    const node       = owner.lookup(moduleName)

    assert(`Node class not found: "${nodeTypeName}"`, node)

    return node
  },

})
