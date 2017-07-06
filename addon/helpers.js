// ----- Ember modules -----
import Helper from 'ember-helper'
import service from 'ember-service/inject'

// ----- Own modules -----



export const dispatchAction = Helper.extend({
  zen : service(),

  compute () {
    return (...args) => {
      this.get('zen').dispatchAction(...args)
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



export const dispatchSetProperties = Helper.extend({
  zen : service(),

  compute () {
    return (...args) => {
      this.get('zen').dispatchSetProperties(...args)
    }
  },
})
