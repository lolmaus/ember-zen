// ----- Ember modules -----
import service from 'ember-service/inject'

// ----- Ember addons -----
import GitHubOAuth2Provider from 'torii/providers/github-oauth2'



export default GitHubOAuth2Provider.extend({

  // ----- Services -----
  config : service(),



  // ----- Overridden methods -----
  fetch (data) { return data },
})
