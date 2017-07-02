// ----- Ember modules -----
// import {reads} from 'ember-computed'


// ----- Ember addons -----
import raw from 'ember-macro-helpers/raw'
// import computed from 'ember-macro-helpers/computed'
// import or from 'ember-awesome-macros/or'
import findBy from 'ember-awesome-macros/array/find-by'

// ----- Own modules -----
import {Node} from 'ember-zen'



export default Node.extend({

  // ----- Attributes -----
  attrNames : [
    'isExpanded',
    'isDeleting',
    'slug',
  ],

  isExpanded : false,
  isDeleting : false,
  slug       : false,



  // ----- Computed properties -----
  list : findBy('zen.state.github.lists', raw('slug'), 'slug'),



  // ----- Actions -----
  // actions : {
  // }
})
