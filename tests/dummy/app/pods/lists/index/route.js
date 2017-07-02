// ----- Ember modules -----
import Route from 'ember-route'
import service from 'ember-service/inject'

// ----- Ember addons -----
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'



export default Route.extend(AuthenticatedRouteMixin, {

  // ----- Services -----
  zen : service(),



  // ----- Overridden methods -----
  // beforeModel () {
  //   this._super(...arguments)
  // }
})
