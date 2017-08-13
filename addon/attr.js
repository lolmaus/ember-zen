// ----- Ember modules -----
// import {readOnly} from '@ember/object/computed'
import EmberObject/*, {get, getProperties}*/ from '@ember/object'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'
// import writable from 'ember-macro-helpers/writable'

// ----- Own modules -----
import {ATTR_KEY} from './constants'
import {returnValueOrValue} from './utils/return-value-or-value'



export default EmberObject.extend({

  // ----- Overridable properties -----
  initialValue : null,

  // ----- Overridable methods -----
  serialize (value/*, options*/) {
    return value
  },

  deserialize (value/*, options*/) {
    return value
  },

  doesMatchType (/*value, options*/) {
    return true
  },

  getInitialValue ({allowNully} = {}/*, node*/) {
    return allowNully ? null : returnValueOrValue(this.get('initialValue'))
  },
})




export function attr (type, options = {}) {
  return {
    type,
    ...options,
    [ATTR_KEY] : true,
  }
}
