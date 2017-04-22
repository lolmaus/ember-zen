// ----- Ember modules -----
import ArrayProxy from 'ember-controller/proxy'
import NodeMixin from 'ember-shelf/node-mixin'



export default ArrayProxy.extend(NodeMixin, {

  // ----- Public methods -----
  valueOf () {
    return this
      .get('content')
      .map(value => this._returnWithValueOf(value))
  },

})
