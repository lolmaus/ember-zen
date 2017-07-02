// ----- Ember modules -----
// import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import {Node, createNodeCP} from 'ember-zen'



export default Node.extend({
  attrNames : [
    'lists_index',
    'lists_list',
  ],

  lists_index : createNodeCP('lists/index'),
  lists_list  : createNodeCP('lists/list'),
})
