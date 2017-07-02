// ----- Ember modules -----
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import Node from 'ember-zen/node'



export default Node.extend({
  // ----- Attributes -----
  attrNames : [
    'filename',
    'type',
    'language',
    'raw_url',
    'size',
    'truncated',
    'content',
  ],

  filename  : null,
  type      : null,
  language  : null,
  raw_url   : null,
  size      : null,
  truncated : null,
  content   : null,



  // ----- Computed properties -----
  slug : computed('filename', filename => {
    const match = filename.match(/[\w-]+-([\w-]+)\.[\w-]+/)
    return match && match[1]
  }),
})
