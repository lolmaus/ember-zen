import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import Node from 'ember-shelf/node'
import TodoNode from 'dummy/nodes/todo'
import Service from 'ember-service'
import computed from 'ember-macro-helpers/computed'
// import {guidFor} from 'ember-metal/utils'
// import {GUID_KEY, NAME_KEY} from 'ember-shelf/constants'


let m // eslint-disable-line no-unused-vars



describe('Unit | Service | shelf', function () {
  setupTest('service:shelf', {
    // Specify the other units that are required for this test.
    needs : ['node:todo'],
  })

  beforeEach(function () {
    this.registry.optionsForType('node', {singleton : false})
  })

  let m



  it('createNode', function () {
    const shelf = this.subject()
    const taskNode = shelf.createNode('todo')

    m = "taskNode should be instance of Node"
    expect(taskNode, m).instanceof(Node)

    m = "taskNode should be instance of TodoNode"
    expect(taskNode, m).instanceof(TodoNode)

    const anotherTaskNode = shelf.createNode('todo')

    m = "Two TodoNode instances should be different"
    expect(taskNode, m).not.equal(anotherTaskNode)

    m = "shelf property should contain the service"
    expect(taskNode.get('shelf'), m).instanceof(Service)
  })



  it('createNode, props as second arg', function () {
    const shelf = this.subject()
    const parent = shelf.createNode('todo')
    const child  = shelf.createNode('todo', {foo : 'bar', parent : parent})

    expect(child.get('foo')).equal('bar')
    expect(child.get('parent')).equal(parent)
  })



  it('dispatch, called with a string', function () {
    const shelf = this.subject()

    const node = shelf.createNode('todo', {actions : {
      actionName (val1, val2) { this.set('quux', val1 + val2) }
    }})

    sinon.spy(node.actions, "actionName")

    shelf.set('foo',     shelf.createNode('todo'))
    shelf.set('foo.bar', node)

    shelf.dispatch('foo.bar', 'actionName', 'quux', 'zomg')

    expect(node.actions.actionName).calledOnce
    expect(node.actions.actionName).calledWithExactly('quux', 'zomg')
    expect(node.get('quux')).equal('quuxzomg')
  })



  it('dispatch, called with a string, missing node', function () {
    const shelf = this.subject()

    const attemptCallback = () => {
      shelf.dispatch('foo.bar', 'actionName', 'quux', 'zomg')
    }

    expect(attemptCallback).throw(/Node not found: "foo\.bar"/)
  })



  it('restore simple', function () {
    const shelf = this.subject()

    const FooNode = Node.extend({
      attrNames : [
        'foo',
        'bar',
      ],

      foo : 'Foo!',
      bar : computed('foo', foo => foo.toUpperCase())
    })

    const fooNode = FooNode.create()

    const oldState = {
      foo : 'Zomg!',
      bar : 'incorrect',
    }

    shelf.restore(fooNode, oldState)

    m = 'Should overwrite simple value'
    expect(fooNode.get('foo'), m).equal('Zomg!')

    m = 'Should skip CP'
    expect(fooNode.get('bar'), m).equal('ZOMG!')
  })



  it('restore, same child node type', function () {
    const shelf = this.subject()

    const FooNode = Node.extend({
      attrNames : ['foo'],
      nodeName  : 'foo',
    })

    const BarNode = Node.extend({
      attrNames : ['foo', 'child'],

      child : computed(function () {
        return FooNode.create({parent : this})
      }),

      nodeName : 'bar'
    })

    const barNode = BarNode.create({foo : 'Foo!'})
    const fooNode = barNode.get('child')

    const oldState = {
      [NAME_KEY] : 'bar',
      foo        : 'Zomg!',

      bar : {
        [NAME_KEY] : 'foo',
        foo        : 'Lol!'
      }
    }

    shelf.restore(barNode, oldState)

    m = 'Child node instance should not change'
    expect(barNode.get('child'), m).equal(fooNode)
  })



  it('restore, different child node type', function () {
    const shelf = this.subject()

    const FooNode = Node.extend({
      attrNames : ['foo'],
      nodeName  : 'foo',
    })

    // const BazNode = Node.extend({
    //   attrNames : ['foo'],
    //   nodeName  : 'baz',
    // })

    const BarNode = Node.extend({
      attrNames : ['foo', 'child'],

      child : computed(function () {
        return FooNode.create({parent : this})
      }),

      nodeName : 'bar'
    })

    const barNode = BarNode.create({foo : 'Foo!'})
    const fooNode = barNode.get('child')

    const oldState = {
      [NAME_KEY] : 'bar',
      foo        : 'Zomg!',

      bar : {
        [NAME_KEY] : 'baz',
        foo        : 'Lol!'
      }
    }

    shelf.restore(barNode, oldState)

    m = 'Child node instance should not change'
    expect(barNode.get('child'), m).not.equal(fooNode)

    m = 'child.foo'
    expect(barNode.get('child.foo'), m).equal('Lol!')

    m = 'child.nodeName'
    expect(barNode.get('child.nodeName'), m).equal('baz')
  })
})
