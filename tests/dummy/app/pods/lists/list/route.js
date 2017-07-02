// ----- Ember modules -----
import Route from 'ember-route'
import service from 'ember-service/inject'

// ----- Ember addons -----



export default Route.extend({

  // ----- Services -----
  zen : service(),



  // ----- Overridden methods -----
  model ({slug}) {
    return {slug}
  },
})
