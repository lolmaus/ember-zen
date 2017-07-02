// ----- Ember modules -----
// import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----
import ArrayNode from 'ember-zen/node-array'



export default ArrayNode.extend({

  // ----- Private methods -----
  _createOrUpdateListItemStates () {
    const zen          = this.get('zen')
    const listItemStates = zen.get('state.routes.lists_index.listItemStates')

    const newListItemState = this.map(list => {
      const slug = list.get('slug')

      let listItemState = listItemStates.findBy('list.slug', slug)

      if (!listItemState) {
        listItemState =
          zen.createNode('components/lists-list/item', {
            slug,
            parent : listItemStates,
          })
      }

      return listItemState
    })

    listItemStates.set('content', newListItemState)
  },



  // ----- Actions -----
  actions : {
    addLists (payload) {
      this.createAndSetChildNodes('github/lists/list', payload)
      this._createOrUpdateListItemStates()
    },
  },
})
