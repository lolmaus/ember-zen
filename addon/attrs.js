// ----- Ember modules -----
import computed from 'ember-computed'

// ----- Own modules -----
import {ATTR_KEY} from './constants'



export function makeAttrWrapper (callback) {
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



export function makeAttr (callback) {
  return makeAttrWrapper(function (key) {
    const value = callback.call(this, key)
    this._createAttr(key, value)
  })
}



export function makeAttrs (callback) {
  return makeAttrWrapper(function (key) {
    const obj = callback.call(this, key)
    this._createAttrs(obj)
  })
}



export const nodeAttr = makeAttr(function (key) {
  return this.get('zen').createNode(key, {parent : this})
})



export const promiseAttr = makeAttrs(function (key) {
  return {
    [`${key}IsPending`]   : false,
    [`${key}IsRejected`]  : false,
    [`${key}IsFulfilled`] : false,
    [`${key}IsSettled`]   : false,
    [`${key}Response`]    : undefined,
    [`${key}Error`]       : undefined,
    [`${key}Promise`]     : undefined,
  }
})
