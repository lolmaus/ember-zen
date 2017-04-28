// ----- Ember modules -----
import ArrayProxy from 'ember-controller/proxy'
import NodeMixin from 'ember-shelf/node-mixin'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'



export default ArrayProxy.extend(NodeMixin, {

  // ----- Attributes -----
  content : computed(() => []),



  // ----- Public mehtods -----
  createAndSetChildNodes (nodeTypeName, arrayPayload) {
    const childNodes =
      arrayPayload
        .map(payload => this.createChildNode(nodeTypeName, payload))

    this.set('content', childNodes)
    return childNodes
  },



  // ----- Public methods -----
  valueOf () {
    return this
      .get('content')
      .map(value => this._returnWithValueOf(value))
  },

})
