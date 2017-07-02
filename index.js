/* eslint-env node */
'use strict'

const _ = require('lodash')

module.exports = {
  name : 'ember-zen',

  init () {
    this._super && this._super.init.apply(this, arguments)

    if (!_.has(this, 'options.babel.plugins')) {
      _.set(this, 'options.babel.plugins', [])
    }

    this.options.babel.plugins.push('transform-object-rest-spread')
  },
}
