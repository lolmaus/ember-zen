import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location : config.locationType,
  rootURL  : config.rootURL,
})

Router.map(function () {
  this.route('login')
  this.route('lists', function () {
    this.route('list', {path : ':slug'})
  })
})

export default Router
