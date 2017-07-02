// ----- Ember modules -----
import Component from 'ember-component'
import {reads} from 'ember-computed'
import service from 'ember-service/inject'

// ----- Ember addons -----
// import computed from 'ember-macro-helpers/computed'
// import {createNodeCP} from 'ember-zen'



export default Component.extend({

  // ----- Arguments -----
  state : undefined,



  // ----- Services -----
  github : service(),



  // ----- Aliases -----
  list : reads('state.list'),



  // ----- Actions -----
  actions : {
    remove () {
      const slug    = this.get('list.slug')
      const message = `Delete list ${slug}?`

      if (!window.confirm(message)) return

      const state  = this.get('state')
      const github = this.get('github')

      state.dispatchSet('isDeleting', true)

      github
        .deleteList(slug)
        .finally(() => {
          state.dispatchSet('isDeleting', false)
        })
    },
  },


})
