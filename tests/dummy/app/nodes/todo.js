import Node from 'ember-shelf/node'



export default Node.extend({
  attrNames : [
    'title',
    'isCompleted',
  ],

  title       : "New todo",
  isCompleted : false,
})
