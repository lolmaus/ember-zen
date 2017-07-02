// ----- Ember modules -----
import {reads} from 'ember-computed'

// ----- Ember addons -----
import computed from 'ember-macro-helpers/computed'

// ----- Third party modules -----
import _ from 'lodash'

// ----- Own modules -----
import Node from 'ember-zen/node'



export default Node.extend({

  // ----- Attributes -----
  attrNames : [
    "comments",
    "comments_url",
    "commits_url",
    "created_at",
    "description",
    "files",
    "forks",
    "forks_url",
    "git_pull_url",
    "git_push_url",
    "history",
    "html_url",
    "id",
    "owner",
    "public",
    "truncated",
    "updated_at",
    "url",
    "user",
  ],



  // ----- Private properties -----
  _fileTypeRegex : /^([\w-]+)-[\w-]+\.[\w-]+$/,



  // ----- Computed properties -----
  filesGroupedByType : computed('files', function (files) {
    return _.groupBy(files, file => this._typeForFile(file))
  }),

  listFiles : reads('filesGroupedByType.list'),



  // ----- Methods -----
  _typeForFile ({name}) {
    const match = name.match(this._fileTypeRegex)
    return match ? match[1] : 'other'
  },



  // ----- Actions -----
  actions : {
    load (payload) {
      this.populate(payload)
      this.get('parent.lists').send('addLists', this.get('listFiles'))
    },
  },
})
