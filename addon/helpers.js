// ----- Ember modules -----
import Helper from '@ember/component/helper'
import {inject as service} from '@ember/service'

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
