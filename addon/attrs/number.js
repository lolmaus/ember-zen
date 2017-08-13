// ----- Ember modules -----
// import {readOnly} from '@ember/object/computed'
// import /*EmberObject, {get, getProperties}*/ from '@ember/object'

// ----- Ember addons -----
// import writable from 'ember-macro-helpers/writable'

// ----- Own modules -----
import Attr from '../attr'



export default  Attr.extend({

  // ----- Overridden methods -----
  doesMatchType (value, {allowNully} = {}) {
    return (
      (typeof value === 'number' && !isNaN(value))
      || (allowNully && value == null)
    )
  },

})
