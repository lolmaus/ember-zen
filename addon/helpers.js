// ----- Ember modules -----
import Helper from 'ember-helper'
import service from 'ember-service/inject'

// ----- Own modules -----



export const dispatch = Helper.extend({
  shelf : service(),

  compute () {
    return (...args) => {
      this.get('shelf').dispatch(...args)
    }
  }
})



export const dispatchSet = Helper.extend({
  shelf : service(),

  compute () {
    return (...args) => {
      this.get('shelf').dispatchSet(...args)
    }
  }
})
