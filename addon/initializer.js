export function initialize (application) {
  application.registerOptionsForType('zen-node', {singleton : false})
  application.registerOptionsForType('zen-attr')

  // Inject zen service
  application.inject('controller', 'zen', 'service:zen')
  application.inject('route',      'zen', 'service:zen')
  application.inject('zen-node',   'zen', 'service:zen')
  application.inject('zen-attr',   'zen', 'service:zen')
}

export default {
  name : 'ember-zen',
  initialize,
}
