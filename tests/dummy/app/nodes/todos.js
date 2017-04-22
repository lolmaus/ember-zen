import computed from 'ember-computed'
import {A} from 'ember-array/utils'
import NodeArray from 'ember-shelf/node-array'



export default NodeArray.extend({
  content : computed(() => A()),

  actions : {
    addTodo (props) {
      const newNode = this.get('shelf').createNode('todo', {...props, parent : this})

      this.pushObject(newNode)
    }
  }
})
