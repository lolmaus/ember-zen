// ----- Ember modules -----
import get from 'ember-metal/get'
import {A} from 'ember-array/utils'


// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'
import createClassComputed from 'ember-macro-helpers/create-class-computed'
import normalizeArrayKey from 'ember-macro-helpers/normalize-array-key'



export const createNodeCP =
  name =>
    computed(function () {
      return this.get('shelf').createNode(name, {parent : this})
    })




export const mapExisting = createClassComputed(
  // the first param is the observer list
  // it refers to incoming keys
  // the bool is whether a value change should recreate the macro
  [
    false, true, false
  ],
  // the second param is the callback function where you create your computed property
  // it is passed in the values of the properties you marked true above
  (arrayPropName, callback) => {
    let previousItems = new Map()

    // when `key` changes, we need to watch a new property on the array
    // since our computed property is now invalid, we need to create a new one
    return computed(
      `${arrayPropName}.[]`, callback,
      function (array, callback) {
        previousItems.forEach((value, item) => {
          if (array.includes(item)) return
          previousItems.delete(item)
        })

        if (!array) return A()

        const result = array.map((item, index) => {
          if (previousItems.has(item)) return previousItems.get(item)

          const value = callback.call(this, item, index, array)

          previousItems.set(item, value)

          return value
        })

        return A(result)
      }
    )
  }
)




export const mapExistingByKey = createClassComputed(
  // the first param is the observer list
  // it refers to incoming keys
  // the bool is whether a value change should recreate the macro
  [
    false, true, false
  ],
  // the second param is the callback function where you create your computed property
  // it is passed in the values of the properties you marked true above
  (arrayPropName, itemPropName, callback) => {
    let previousItems = new Map()

    // when `key` changes, we need to watch a new property on the array
    // since our computed property is now invalid, we need to create a new one
    return computed(
      normalizeArrayKey(arrayPropName, [itemPropName]), callback,
      function (array, callback) {
        if (!array) {
          previousItems = new Map()
          return A()
        }

        const items = array.map(item => get(item, itemPropName))

        previousItems.forEach((value, item) => {
          if (items.includes(item)) return
          previousItems.delete(item)
        })

        const result = array.map((item, index) => {
          const key = get(item, itemPropName)

          if (previousItems.has(key)) return previousItems.get(key)

          const value = callback.call(this.context, item, index, array)

          previousItems.set(key, value)

          return value
        })

        return A(result)
      }
    )
  }
)
