// ----- Ember modules -----
import Service from 'ember-service'
import {assert} from 'ember-metal/utils'
import getOwner from 'ember-owner/get'
import computed from 'ember-computed'

// ----- Own modules -----
import Node      from 'ember-shelf/node'
import NodeArray from 'ember-shelf/node-array'



export default Service.extend({

  // ----- Computed properties -----
  owner : computed(function () { return getOwner(this) }),



  // ----- Overridden methods -----
  init () {
    this._super(...arguments)
    this.dispatch = this.dispatch.bind(this)
  },



  // ----- Public methods -----
  dispatch (nodeOrPath, actionName, ...args) {
    const node = this._getNode(nodeOrPath)

    assert('Dispatch called without a node', node)
    assert('Node must be an instance of Node', node instanceof Node || node instanceof NodeArray)

    assert('Dispatch called without an action name', actionName && actionName.length)
    assert('Action name must be a string', typeof actionName === 'string')

    const action = node.actions && node.actions[actionName]
    assert(`Action ${actionName} does not exist`, action)
    assert(`Action ${actionName} is not a function`, typeof action === 'function')

    const result = action.apply(node, args)

    this.logStateChangeOnNode(actionName, node)

    return result
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



  logStateChangeOnNode (actionName, nodeOrPath) {
    // debugger
    const node     = this._getNode(nodeOrPath)
    const nodeName = node.get('nodeName')

    let message = `"${actionName}" action called on node "${nodeName}"`

    const result = {
      node,
      nodeName
    }

    const rootNode = this._getNodeRootParent(node)
    if (node !== rootNode) {
      const rootNodeName = rootNode.get('nodeName')
      message += `, belonging to tree "${rootNodeName}"`

      result.rootNode     = rootNode
      result.rootNodeName = rootNodeName
    }

    const state = rootNode.valueOf()

    console.info(message, state, result)
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
  }
})
