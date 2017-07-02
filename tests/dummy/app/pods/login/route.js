// ----- Ember modules -----
import Route from 'ember-route'

// ----- Ember addons -----
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin'



export default Route.extend(UnauthenticatedRouteMixin, {
})
