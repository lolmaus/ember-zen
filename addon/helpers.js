// ----- Ember modules -----
import Helper from 'ember-helper'
import service from 'ember-service/inject'

// ----- Own modules -----



export const dispatch = Helper.extend({
  zen : service(),

  compute () {
    return (...args) => {
      this.get('zen').dispatch(...args)
    }
  },
})



export const dispatchSet = Helper.extend({
  zen : service(),

  compute () {
    return (...args) => {
      this.get('zen').dispatchSet(...args)
    }
  },
})
