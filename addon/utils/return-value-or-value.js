export function returnValueOrValue (maybeFunction, context) {
  return typeof maybeFunction === 'function' ? maybeFunction.call(context) : maybeFunction
}
