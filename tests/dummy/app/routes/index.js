import Route from 'ember-route'
import service from 'ember-service/inject'



export default Route.extend({

  shelf : service(),

  afterModel () {
    const shelf = this.get('shelf')

    shelf.dispatch('state.todos', 'addTodo', {title : "Make a demo"})

    console.log('shelf', shelf)
  }
})
