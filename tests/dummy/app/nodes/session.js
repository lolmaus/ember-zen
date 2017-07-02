// ----- Ember modules -----
// import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import Node from 'ember-zen/node'



export default Node.extend({
  attrNames : [
    'isAuthenticated',
    'isAuthenticating',

    'provider',
    'token',
    'user',
  ],

  isAuthenticated  : false,
  isAuthenticating : false,

  actions : {
    startAuthentication () {
      this.setProperties({
        isAuthenticated  : false,
        isAuthenticating : true,

        provider : null,
        token    : null,
        user     : null,
      })
    },

    authenticate ({provider, token, user}) {
      this.setProperties({
        isAuthenticated  : true,
        isAuthenticating : false,

        provider,
        token,
        user,
      })
    },

    invalidate () {
      this.setProperties({
        isAuthenticated  : false,
        isAuthenticating : false,

        provider : null,
        token    : null,
        user     : null,
      })
    },
  },
})
