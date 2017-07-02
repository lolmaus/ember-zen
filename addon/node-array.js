// ----- Ember modules -----
import ArrayProxy from 'ember-controller/proxy'
import NodeMixin from 'ember-zen/node-mixin'
import {guidFor} from 'ember-metal/utils'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import {GUID_KEY, NAME_KEY} from 'ember-zen/constants'

// ----- Old-school Ember imports -----
import Ember from 'ember'
const {ComputedProperty} = Ember



export default ArrayProxy.extend(NodeMixin, {

  // ----- Attributes -----
  content : computed(() => []),



  // ----- Public methods -----
  createAndSetChildNodes (nodeTypeName, arrayPayload) {
    const childNodes =
      arrayPayload
        .map(payload => this.createChildNode(nodeTypeName, payload))

    this.set('content', childNodes)
    return childNodes
  },



  valueOf () {
    const snapshot =
      this
        .get('content')
        .map(value => this._returnWithValueOf(value))

    snapshot[GUID_KEY] = guidFor(this)
    snapshot[NAME_KEY] = this.get('nodeName')

    return snapshot
  },



  restore (snapshot) {
    // Skip read-only or CPs with dependent keys and no setter
    if (
      this.content instanceof ComputedProperty
      && (
        (
          this.content._dependentKeys
          && this.content._dependentKeys.length
          && !(typeof this.content._setter === "function")
        )
        || this.content._readOnly
      )
    ) return

    const oldContentByGuid =
      this
        .get('content')
        .reduce((result, item) => {
          const guid = guidFor(item)
          result[guid] = item
          return result
        }, {})

    const newContent =
      snapshot
        .map(snapshotItem => {
          const snapshotItemGuid = snapshotItem && snapshotItem[GUID_KEY]

          // If element is not a node, just set it and carry on
          if (!snapshotItemGuid) return snapshotItem

          let   node     = oldContentByGuid[snapshotItemGuid]
          const nodeName = snapshotItem[NAME_KEY]

          if (!node) {
            node = this.createChildNode(nodeName)
          }

          node.restore(snapshotItem)

          return node
        })

    this.set('content', newContent)

    return this
  },
})
