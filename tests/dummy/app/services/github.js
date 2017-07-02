// ----- Ember modules -----
import Service from 'ember-service'
import service from 'ember-service/inject'
import {reads} from 'ember-computed'

// ----- Ember addons -----
// import computed from 'ember-macro-helpers/computed'

// ----- Third-party modules -----
import RSVP from 'rsvp'

// ----- Own modules -----
import {
  fetchGithubAuthJson,
  fetchGithubAuthText,
} from 'dummy/utils/fetch-github'



export default Service.extend({

  // ----- Services -----
  zen : service(),



  // ----- Configurable properties -----


  // ----- Aliases -----
  state    : reads('zen.state.github'),
  session  : reads('zen.state.session'),
  token    : reads('session.token'),
  username : reads('session.user.login'),



  // ----- Private properties -----
  gistIdLSKey : 'dummy:gist-id',


  // ----- Public Methods -----
  fetchJson (url, params) {
    const token = this.get('token')
    return fetchGithubAuthJson(url, token, params)
  },

  fetchText (url, params) {
    const token = this.get('token')
    return fetchGithubAuthText(url, token, params)
  },

  postJson (url, body, params = {}) {
    params = {
      ...params,
      body,
      method : 'POST',

      headers : {
        'Content-Type' : 'application/json',
      },
    }

    return this.fetchJson(url, params)
  },

  patchJson (url, body, params = {}) {
    params = {
      ...params,
      body,
      method : 'PATCH',

      headers : {
        'Content-Type' : 'application/json',
      },
    }

    return this.fetchJson(url, params)
  },

  readGistIdFromLS () {
    const lsKey = this.get('gistIdLSKey')
    return window.localStorage.getItem(lsKey)
  },

  createGist (data) {
    const url = "gists"
    return this
      .postJson(url, data)
      .then(response => this._processGist(response))
  },

  loadGist (gistId) {
    const url = `gists/${gistId}`
    return this
      .fetchJson(url)
      .then(response => this._processGist(response))
  },

  createList (slug) {
    return this._updateList(slug, {content : '<new list>'})
  },

  deleteList (slug) {
    return this._updateList(slug, null)
  },



  // ----- Private methods -----
  _buildSearchQuery (obj) {
    const params = {...obj, per_page : 100}

    return Object
      .keys(params)
      .map(key => `${key}:${params[key]}`)
      .join('+')
  },

  _writeGistIdToLS (gistId) {
    const lsKey = this.get('gistIdLSKey')
    return window.localStorage.setItem(lsKey, gistId)
  },

  _processGist (response) {
    return RSVP
      .hash({
        ...response,
        files : this._processFiles(response.files),
      })
      .then(gist => {
        this._writeGistIdToLS(gist.id)
        this.get('state.gist').dispatch('load', gist)
      })
  },

  _processFiles (files) {
    const filesAndPromises =
      Object
        .keys(files)
        .map(name => ({...files[name], name}))
        .map(file => file.truncated ? this._fetchTruncatedFile(file) : file)

    return RSVP.all(filesAndPromises)
  },

  _fetchTruncatedFile (file) {
    return this
      .fetchText(file.raw_url)
      .then(content => ({...file, content}))
  },

  _updateList (slug, content) {
    const gistId = this.readGistIdFromLS()
    const url = `gists/${gistId}`
    const fileName = `list-${slug}.txt`

    const data = {
      files : {
        [fileName] : content,
      },
    }

    return this
      .patchJson(url, data)
      .then(response => this._processGist(response))
  },
})
