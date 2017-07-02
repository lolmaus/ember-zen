// ----- Ember modules -----
import {reads} from 'ember-computed'


// ----- Ember addons -----
// import computed from 'ember-macro-helpers/computed'
// import raw from 'ember-macro-helpers/raw'
import or from 'ember-awesome-macros/or'
import not from 'ember-awesome-macros/not'
// import raw from 'ember-macro-helpers/raw'

// ----- Own modules -----
import {Node, createNodeCP} from 'ember-zen'



export default Node.extend({
  // ----- Attributes -----
  attrNames : [
    'userInputGistId',
    'userInputListSlug',
    'isLoadingGist',
    'isCreatingGist',
    'isCreatingList',
    'listItemStates',
  ],

  userInputGistId   : reads('zen.state.github.gist.id'),
  userInputListSlug : '',

  isLoadingGist  : false,
  isCreatingGist : false,
  isCreatingList : false,

  listItemStates : createNodeCP('list-item-states'),


  // ----- Computed properties -----
  isCreateButtonDisabled    : reads('isCreatingGist'),
  isCreatListButtonDisabled : or('isCreatingList', not('userInputListSlug.length')),



  // ----- Actions -----
  actions : {
    userInputsGistId (userInputGistId) {
      this.setProperties({userInputGistId})
    },

    userInputsListSlug (userInputListSlug) {
      this.setProperties({userInputListSlug})
    },

    startedCreatingGist () {
      this.set('isCreatingGist', true)
    },

    finishedCreatingGist () {
      this.set('isCreatingGist', false)
    },

    startedCreatingList () {
      this.set('isCreatingList', true)
    },

    finishedCreatingList () {
      this.set('isCreatingList', false)
    },
  },
})
