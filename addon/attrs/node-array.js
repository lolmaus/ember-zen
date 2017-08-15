// ----- Ember modules -----
// import {readOnly} from '@ember/object/computed'
// import /*EmberObject, {get, getProperties}*/ from '@ember/object'

// ----- Ember addons -----
// import writable from 'ember-macro-helpers/writable'

// ----- Own modules -----
import Attr from '../attr'
import Node from '../node'



export default  Attr.extend({

  // ----- Overridden properties -----
  initialValue () { return [] },



  // ----- Overridden methods -----
  serialize (array/*, {key}*/) {
    return array.map(node => node.serialize())
  },

  doesMatchType (node, {allowNully, name} = {}) {
    return (
      (
        (node instanceof Node)
        && node.get('nodeName') === name
      )
      || (
          allowNully
          && node == null
        )
    )
  },

})