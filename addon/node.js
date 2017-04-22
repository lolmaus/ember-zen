// ----- Ember modules -----
import EmberObject from 'ember-object'
import NodeMixin from 'ember-shelf/node-mixin'
import {assert} from 'ember-metal/utils'



export default EmberObject.extend(NodeMixin, {

  // ----- Public methods -----
  valueOf () {
    const attrNames = this.get('attrNames')

    assert('attrNames must be an array', attrNames instanceof Array)

    return attrNames.reduce((result, key) => {
      const value = this.get(key)
      result[key] = this._returnWithValueOf(value)
      return result
    }, {})
  },
})
