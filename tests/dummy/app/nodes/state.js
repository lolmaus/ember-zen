import Node from 'ember-shelf/node'
import computed from 'ember-macro-helpers/computed'



export default Node.extend({
  attrNames : [
    'todos'
  ],

  todos : computed(function () {
    return this.get('shelf').createNode('todos', {parent : this})
  }),
})
