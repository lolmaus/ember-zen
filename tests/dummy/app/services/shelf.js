// ----- Ember modules -----
import on from 'ember-evented/on'
import {next} from 'ember-runloop'

// ----- Ember addon -----
import ZenService from 'ember-zen/service'
import computed from 'ember-macro-helpers/computed'

// ----- Own modules -----



export default ZenService.extend({

  // ----- Custom properties -----
  state : computed(function () {
    return this.createNode('state')
  }),



  // ----- Events and observers -----
  logInitial : on('init', function () {
    next(this, this.logStateChangeOnNode, 'state', '@@INIT')
  }),
})
