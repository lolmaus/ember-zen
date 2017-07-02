/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon')
const Funnel   = require('broccoli-funnel')
const fs       = require('fs')



const environment   = process.env.EMBER_ENV || 'development'
const defaultTarget = environment === 'production' ? 'prod' : 'localhost-4200'
const target        = process.env.HB_DEPLOY_TARGET || defaultTarget
const dotEnvFile    = `./.env-${target}`

if (!fs.existsSync(dotEnvFile)) {
  if (process.env.HB_DEPLOY_TARGET) {
    throw new Error(`dot-env file specified but not found: ${dotEnvFile}`)
  } else {
    console.warn(`default dot-env file not found: ${dotEnvFile}, assuming env vars are passed manually`)
  }
}



module.exports = function (defaults) {
  const options = {
    babel : {
      plugins : [
        'transform-object-rest-spread',
      ],
    },

    'ember-cli-babel' : {
      // includePolyfill : true,
    },

    nodeModulesToVendor : [
      new Funnel('node_modules/lodash', {
        destDir : 'lodash',
        files   : ['lodash.js'],
      }),
    ],
  }

  if (fs.existsSync(dotEnvFile)) {
    options.dotEnv = {
      clientAllowedKeys : [
        'HB_DEPLOY_TARGET',
        'HB_GITHUB_CLIENT_ID',
        'HB_GATEKEEPER_URL',
      ],
      path : dotEnvFile,
    }
  }

  const app = new EmberAddon(defaults, options)

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree()
}
