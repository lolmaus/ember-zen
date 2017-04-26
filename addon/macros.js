// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'



export const createNodeCP =
  name =>
    computed(function () {
      return this.get('shelf').createNode(name, {parent : this})
    })
