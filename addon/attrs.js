// ----- Ember modules -----
import computed from 'ember-computed'

// ----- Own modules -----



export const nodeAttr = computed({
  get (key) {
    return function () {
      const node = this.get('zen').createNode(key, {parent : this})
      this.set(key, node)
      this.get('_attrKeys').addObject(key)
    }
  },
})



export const promiseAttr = computed({
  get (key) {
    return function () {
      const keyIsPending   = `${key}IsPending`
      const keyIsRejected  = `${key}IsRejected`
      const keyIsFulfilled = `${key}IsFulfilled`
      const keyIsSettled   = `${key}IsSettled`
      const keyResponse    = `${key}Response`
      const keyError       = `${key}Error`
      const keyPromise     = `${key}Promise`

      this.setProperties({
        [keyIsPending]   : false,
        [keyIsRejected]  : false,
        [keyIsFulfilled] : false,
        [keyIsSettled]   : false,
        [keyResponse]    : undefined,
        [keyError]       : undefined,
        [keyPromise]     : undefined,
      })

      this.get('_attrKeys').addObjects([
        keyIsPending,
        keyIsRejected,
        keyIsFulfilled,
        keyIsSettled,
        keyResponse,
        keyError,
      ])
    }
  },
})
