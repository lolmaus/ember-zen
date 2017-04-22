export function initialize (appInstance) {
  // Nodes aren't singletons
  appInstance.registerOptionsForType('node', {singleton : false})

  // Inject shelf service
  appInstance.inject('node',       'shelf', 'service:shelf')
  appInstance.inject('controller', 'shelf', 'service:shelf')
  appInstance.inject('route',      'shelf', 'service:shelf')
}



export default {
  name : 'register-node',
  initialize
}
