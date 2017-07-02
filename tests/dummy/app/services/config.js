// ----- Ember modules -----
import Service from 'ember-service'
import {alias} from 'ember-computed'

// ----- Own modules -----
import config from 'dummy/config/environment'



export default Service.extend({

  // ----- Services -----



  // ----- Overridden properties -----



  // ----- Static properties -----
  envVars       : config.envVars,
  gatekeeperUrl : alias('envVars.HB_GATEKEEPER_URL'),



  // ----- Computed properties -----



  // ----- Overridden Methods -----



  // ----- Custom Methods -----



  // ----- Events and observers -----



  // ----- Tasks -----

})
