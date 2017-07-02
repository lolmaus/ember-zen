// ----- Ember modules -----
import Route from 'ember-route'

// ----- Ember addons -----



export default Route.extend({

  // ----- Overridden properties -----
  beforeModel () {
    this.transitionTo('lists')
  },
})
