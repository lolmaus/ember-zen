// ----- Ember modules -----
import Service from 'ember-service'
import {assert} from 'ember-metal/utils'
import getOwner from 'ember-owner/get'
import computed from 'ember-computed'
// import get from 'ember-metal/get'
import {A} from 'ember-array/utils'
// import on from 'ember-evented/on'

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

    callback()

    this.logStateChangeOnNode(node, message, params)
  },



  dispatchAction (nodeOrPath, actionName, ...args) {
    const node    = this._getNode(nodeOrPath)
    const message = `action "${actionName}"`
    const action  = () => node.send(actionName, ...args)

    this.dispatch(nodeOrPath, message, action, {actionName, args})
  },



  dispatchSet (nodeOrPath, message = `set \`${key}\``, key, value) {
    const node = this._getNode(nodeOrPath)

    assert(
      `Attempted to dispatchSet ${key} on ${node.get('nodeName')}, but ${key} is not an attribute on ${node.get('nodeName')}`,
      A(node.attrNames).includes(key)
    )

    const action  = () => node.set(key, value)

    this.dispatch(node, message, action, {key, value})
  },



  dispatchSetProperties (nodeOrPath, message, obj) {
    const node = this._getNode(nodeOrPath)
    const keys = Object.keys(obj)

    keys.forEach(key => {
      assert(
        `Attempted to dispatchSetProperties ${key} on ${node.get('nodeName')}, but ${key} is not an attribute on ${node.get('nodeName')}`,
        A(node.attrNames).includes(key)
      )
    })

    message = message || "set `" + keys.join("`, `") + "`"
    const action  = () => node.setProperties(obj)

    this.dispatch(node, message, action, {obj})
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
      ...params,
    }

    const rootNode = this._getNodeRootParent(node)
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

  _getNodeRootParent (node) {
    while (node.parent) node = node.parent
    return node
  },

})
