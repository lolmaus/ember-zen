// ----- Ember modules -----
// import computed from 'ember-macro-helpers/computed'
// import {getProperties} from 'ember-metal/get'

// ----- Own modules -----
import {Node, createNodeCP} from 'ember-zen'

// ----- Third-party modules -----



export default Node.extend({
  // ----- Attributes -----
  attrNames : [
    'gist',
    'lists',
  ],

  gist  : createNodeCP('github/gist'),
  lists : createNodeCP('github/lists'),



  // ----- Relationships -----
  actions : {
  },
})
