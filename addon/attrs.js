// ----- Ember modules -----
import computed from 'ember-computed'

// ----- Own modules -----
import {ATTR_KEY} from './constants'



export function makeAttr (callback) {
  const result =  computed({
    get (key) {
      return function () {
        callback.call(this, key)
      }
    },
  })

  result[ATTR_KEY] = true

  return result
}



export function makeSimpleAttr (callback) {
  return makeAttr(function (key) {
    const value = callback.call(this, key)
    this.set(key, value)
    this.get('_attrKeys').addObject(key)
  })
}



export const nodeAttr = makeSimpleAttr(function (key) {
  return this.get('zen').createNode(key, {parent : this})
})



export const promiseAttr = makeAttr(function (key) {
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
})
