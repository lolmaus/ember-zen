// ----- Ember modules -----
import Component from 'ember-component'



export default Component.extend({

  // ----- Arguments -----
  isAuthenticated  : false,
  isAuthenticating : false,

  authenticateSessionAction : undefined,
  invalidateSessionAction   : undefined,
})
