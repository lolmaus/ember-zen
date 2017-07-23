export function initialize (application) {
  // Nodes aren't singletons
  application.registerOptionsForType('node', {
    singleton : false,
  })

  // Inject zen service
  application.inject('node',       'zen', 'service:zen')
  application.inject('controller', 'zen', 'service:zen')
  application.inject('route',      'zen', 'service:zen')
}

export default {
  name : 'foo',
  initialize,
}
