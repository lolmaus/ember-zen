// ----- Ember modules -----
// import {readOnly} from '@ember/object/computed'
// import /*EmberObject, {get, getProperties}*/ from '@ember/object'
import { dasherize } from "@ember/string"

// ----- Ember addons -----
// import writable from 'ember-macro-helpers/writable'

// ----- Own modules -----
import Attr from '../attr'
import Node from '../node'



export default  Attr.extend({

  // ----- Overridden methods -----
  serialize (node, {key}) {
    return node
      ? node.serialize()
      : node
  },

  getInitialValue (options, parentNode) {
    return parentNode.createChildNode({
      ...options,
      nodeName : options.nodeName || options.key,
      nodeType : options.nodeType || dasherize(options.key),
    })
  },

  doesMatchType (node, {allowNully, name} = {}) {
    return (
      (
        (node instanceof Node)
        && node.get('nodeName') === name
      )
      || (
          allowNully
          && node == null
        )
    )
  },

})
