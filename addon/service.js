// ----- Ember modules -----
import Service from 'ember-service'
import {assert} from 'ember-metal/utils'
import getOwner from 'ember-owner/get'
import computed from 'ember-computed'
// import get from 'ember-metal/get'
import {A} from 'ember-array/utils'
// import on from 'ember-evented/on'

// ----- Own modules -----
import Node      from 'ember-shelf/node'
import NodeArray from 'ember-shelf/node-array'



export default Service.extend({

  // ----- Computed properties -----
  owner : computed(function () { return getOwner(this) }),



  // ----- Overridden methods -----



  // ----- Public methods -----
  dispatch (nodeOrPath, actionName, ...args) {
    const node = this._getNode(nodeOrPath)

    assert('Dispatch called without a node', node)

    assert(
      'Node must be an instance of Node or NodeArray',
      node instanceof Node || node instanceof NodeArray
    )

    node.send(actionName, ...args)

    const message = `"${actionName}" action`

    this.logStateChangeOnNode(node, message, {actionName, args})
  },



  dispatchSet (nodeOrPath, key, value) {
    const node = this._getNode(nodeOrPath)

    assert('Dispatch called without a node', node)

    assert(
      'Node must be an instance of Node or NodeArray',
      node instanceof Node || node instanceof NodeArray
    )

    assert(
      `Attempted to dispatchSet ${key} on ${node.get('nodeName')}, but ${key} is not an attribute on ${node.get('nodeName')}`,
      A(node.attrNames).includes(key)
    )

    node.set(key, value)

    const message = `set \`${key}\``

    this.logStateChangeOnNode(node, message, {key, value})
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
    const nodeName = node.get('nodeName')

    message = `${message} called on node "${nodeName}"`

    const result = {
      node,
      nodeName,
      nodeSnapshot : node.valueOf(),
      ...params
    }

    const rootNode = this._getNodeRootParent(node)
    if (node !== rootNode) {
      const rootNodeName = rootNode.get('nodeName')
      message += `, belonging to tree "${rootNodeName}"`

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
    if (nodeOrPath instanceof Node) return nodeOrPath

    assert(`Must be either node or path to node, "${nodeOrPath}" given`, typeof nodeOrPath === 'string')

    const node = this.get(nodeOrPath)

    assert(`Node not found: "${nodeOrPath}"`, node)

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
