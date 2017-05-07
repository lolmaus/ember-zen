// ----- Ember modules -----
import EmberObject from 'ember-object'
import NodeMixin from 'ember-shelf/node-mixin'
import {assert, guidFor} from 'ember-metal/utils'
import {getProperties} from 'ember-metal/get'

// ----- Own modules -----
import {GUID_KEY, NAME_KEY} from 'ember-shelf/constants'

// ----- Old-school Ember imports -----
import Ember from 'ember'
const {ComputedProperty} = Ember





export default EmberObject.extend(NodeMixin, {

  // ----- Public methods -----
  valueOf () {
    const attrNames = this.get('attrNames')

    assert('attrNames must be an array', attrNames instanceof Array)

    const snapshot =
      attrNames.reduce((result, key) => {
        const value = this.get(key)
        result[key] = this._returnWithValueOf(value)
        return result
      }, {})

    snapshot[GUID_KEY] = guidFor(this)
    snapshot[NAME_KEY] = this.get('nodeName')

    return snapshot
  },

  populate (payload) {
    const attrNames = this.get('attrNames')
    const attrs     = getProperties(payload, attrNames)

    this.setProperties(attrs)
    return this
  },


  createAndSetChildNode (propName, nodeTypeName, payload) {
    const childNode = this.createChildNode(nodeTypeName, payload)
    this.set(propName, childNode)
    return childNode
  },

  restore (snapshot) {
    this.attrNames.forEach(attrName => {
      // Skip read-only or CPs with dependent keys and no setter
      if (
        this[attrName] instanceof ComputedProperty
        && (
          (
            this[attrName]._dependentKeys
            && this[attrName]._dependentKeys.length
            && !(typeof this[attrName]._setter === "function")
          )
          || this[attrName]._readOnly
        )
      ) return

      const attrSnapshot = snapshot[attrName]
      const attrNodeName = attrSnapshot && attrSnapshot[NAME_KEY]

      // If attribute is not a node, just set it and carry on
      if (!attrNodeName) {
        this.set(attrName, attrSnapshot)
        return
      }

      let node = this.get(attrName)

      if (!node || attrNodeName !== node.get('nodeName')) {
        node = this.createAndSetChildNode(attrName, attrNodeName)
      }

      node.restore(attrSnapshot)

      return this
    })
  }
})
