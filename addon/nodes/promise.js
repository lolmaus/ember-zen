// ----- Ember modules -----
import { assert } from "@ember/debug"

// ----- Ember addons -----
import and from 'ember-awesome-macros/and'
import not from 'ember-awesome-macros/not'
import or from 'ember-awesome-macros/or'

// ----- Third-party modules -----
import RSVP from 'rsvp'

// ----- Own modules -----
import Node from '../node'
import {attr} from '../attr'



export default Node.extend({

  // ----- Attributes -----
  attrs : {
    isFulfilled : attr('boolean', {initialValue : false}),
    isRejected  : attr('boolean', {initialValue : false}),
    isPending   : attr('boolean', {initialValue : false}),
    content     : null,
    reason      : null,
  },



  // ----- Static properties -----
  promise : null,



  // ----- Computed properties -----
  isSettled  : or('isRejected', 'isFulfilled').readOnly(),
  isPristine : and(not('isSettled'), not('isPending')).readOnly(),
  isIdle     : or('isPristine', 'isSettled').readOnly(),



  // ----- Actions -----
  actions : {
    run (callback, override) {
      assert(
        'Attempted to start a new promise while an existing one is pending, override disabled',
        !override || this.get('isPending')
      )

      this.dispatchSetProperties('starting promise', {
        isFulfilled : false,
        isRejected  : false,
        isPending   : true,
      })

      const promise = callback()

        .then(content => {
          this.dispatchSetProperties('fulfilling promise', {
            isFulfilled : true,
            isPending   : false,
            content,
          })

          return content
        })

        .catch(reason => {
          this.dispatchSetProperties('rejecting promise', {
            isRejected : true,
            isPending  : false,
            reason,
          })

          return RSVP.reject(reason)
        })

      this.setProperties({promise})

      return promise
    },
  },
})
