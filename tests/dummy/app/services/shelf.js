import ShelfService from 'ember-shelf/service'
import computed from 'ember-computed'



export default ShelfService.extend({
  state : computed(function () {
    return this.createNode('state')
  })
})
