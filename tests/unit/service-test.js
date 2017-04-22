import { expect } from 'chai'
import { describe, it } from 'mocha'
import { setupTest } from 'ember-mocha'
import Node from 'ember-shelf/node'
import TodoNode from 'dummy/nodes/todo'
import Service from 'ember-service'


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
})
