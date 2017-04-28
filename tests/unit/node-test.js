import computed from 'ember-computed'
import { expect } from 'chai'
import { describe, it } from 'mocha'
import Node from 'ember-shelf/node'
import NodeArray from 'ember-shelf/node-array'



describe('Unit | Node', function () {
  it('valueOf', function () {
    const CustomNode = Node.extend({
      attrNames : ['arr', 'foo', 'bar', 'baz', 'quux', 'zomg', 'nil'],

      arr : computed(() => NodeArray.create({content : [
        1, 2, 3,
        Node.create({attrNames : ['oh'], oh : 'my'}),
      ]})),
      foo  : computed(() => 'Foo!'),
      bar  : 'Bar!',
      baz  : undefined,
      quux : computed(() => Node.create({attrNames : ['lol'], lol : 'Lol!'})),
      nil  : null,

      fake : true,
    })

    const todo = CustomNode.create({
      baz  : Node.create(),
      zomg : 'Zomg!',
    })

    const expected = {
      arr  : [1, 2, 3, {oh : 'my'}],
      foo  : 'Foo!',
      bar  : 'Bar!',
      baz  : {},
      quux : {
        lol : 'Lol!'
      },
      zomg : 'Zomg!',
      nil  : null,
    }

    expect(todo.valueOf()).eql(expected)
  })

  it('should crash on forbidden attrNames', function () {
    [
      'actions',
      'attrNames',
      'nodeName',
      'parent',
      'shelf',

      '_lazyInjections',
      '_onLookup',
      '_scheduledDestroy',
      'addObserver',
      'beginPropertyChanges',
      'cacheFor',
      'create',
      'decrementProperty',
      'destroy',
      'eachComputedProperty',
      'endPropertyChanges',
      'extend',
      'get',
      'getProperties',
      'getWithDefault',
      'hasObserverFor',
      'incrementProperty',
      'init',
      'metaForProperty',
      'notifyPropertyChange',
      'propertyDidChange',
      'propertyWillChange',
      'removeObserver',
      'reopen',
      'reopenClass',
      'set',
      'setProperties',
      'toString',
      'toggleProperty',
      'willDestroy',
      'concatenatedProperties',
      'isDestroyed',
      'isDestroying',
      'mergedProperties',
    ].forEach(key => {
      const attempt = () => Node.create({attrNames : [key]})
      expect(attempt).throws(new RegExp(`"${key}" is a forbidden key on a node, please use a different one`))
    })
  })
})
