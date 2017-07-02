// ----- Ember modules -----
import Route from 'ember-route'
import service from 'ember-service/inject'

// ----- Ember addons -----
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin'



export default Route.extend(AuthenticatedRouteMixin, {

  // ----- Services -----
  github : service(),

  // ----- Overridden properties -----
  model () {
    const github        = this.get('github')
    const gistIdFromLS  = github.readGistIdFromLS()
    const gistIdFromZen = this.get('zen.state.github.gist.id')

    if (gistIdFromLS && !gistIdFromZen) return github.loadGist(gistIdFromLS)

    return null
  },
})
