// ----- Ember modules -----
import Controller from 'ember-controller'
import {reads} from 'ember-computed'
import service from 'ember-service/inject'

// ----- Ember addons -----
import raw from 'ember-macro-helpers/raw'
import findBy from 'ember-awesome-macros/array/find-by'



export default Controller.extend({

  // ----- Services -----
  github : service(),



  // ----- Aliases -----
  state : reads('zen.state.routes.lists_list'),
  slug  : reads('model.slug'),
  lists : reads('zen.state.github.lists'),



  // ----- Computed properties -----
  list : findBy('lists', raw('slug'), 'slug'),



  // ----- Actions -----
  actions : {
  },
})
