export function initialize (appInstance) {
  // Nodes aren't singletons
  appInstance.registerOptionsForType('node', {singleton : false})

  // Inject zen service
  appInstance.inject('node',       'zen', 'service:zen')
  appInstance.inject('controller', 'zen', 'service:zen')
  appInstance.inject('route',      'zen', 'service:zen')
}



export default {
  name : 'register-node',
  initialize,
}
