import { expect } from 'chai'
import { describe, it } from 'mocha'
import { mapExisting, mapExistingByKey } from 'ember-shelf/macros'
import EObject from 'ember-object'
import {A} from 'ember-array/utils'
import raw from 'ember-macro-helpers/raw'


let m


describe('Unit | Macros', function () {
  it('mapExisting', function () {
    const MyObj = EObject.extend({
      bar : mapExisting('foo', function (item) {
        console.log('cb', arguments)
        return {item}
      })
    })

    const myObj = MyObj.create({foo : A([1, 2, 3])})
    const bar0 = myObj.get('bar')

    m = "initial bar length"
    expect(bar0, m).length(3)

    m = "initial bar[0]"
    expect(bar0.objectAt(0), m).eql({item : 1})

    m = "initial bar[1]"
    expect(bar0.objectAt(1), m).eql({item : 2})

    m = "initial bar[2]"
    expect(bar0.objectAt(2), m).eql({item : 3})

    myObj.set('foo', A([1, 3, 4, 4]))
    const bar1 = myObj.get('bar')

    m = "bar length after update"
    expect(bar1, m).length(4)

    m = "bar[0] after update"
    expect(bar1.objectAt(0), m).eql({item : 1})

    m = "bar[1] after update"
    expect(bar1.objectAt(1), m).eql({item : 3})

    m = "bar[2] after update"
    expect(bar1.objectAt(2), m).eql({item : 4})

    m = "bar[3] after update"
    expect(bar1.objectAt(3), m).eql({item : 4})

    m = "bar[0] should stay the same"
    expect(bar0.objectAt(0), m).equal(bar1.objectAt(0))

    m = "bar[2] should move to bar[1]"
    expect(bar0.objectAt(2), m).equal(bar1.objectAt(1))

    m = "bar[2] should be the same as bar[3]"
    expect(bar1.objectAt(2), m).equal(bar1.objectAt(3))

    myObj.get('foo').pushObject(2)
    const bar2 = myObj.get('bar')

    m = "after pushing `2` back: old bar[1] should NOT be the same as new bar[4]"
    expect(bar0.objectAt(1), m).not.equal(bar2.objectAt(4))
  })

  it('mapExistingByKey, raw key', function () {
    const MyObj = EObject.extend({
      bar : mapExistingByKey('foo', raw('baz'), function (item) {
        return {item : item.baz}
      })
    })

    const myObj = MyObj.create({foo : A([{baz : 1}, {baz : 2}, {baz : 3}])})
    const bar0 = myObj.get('bar')

    m = "initial bar length"
    expect(bar0, m).length(3)

    m = "initial bar[0]"
    expect(bar0.objectAt(0), m).eql({item : 1})

    m = "initial bar[1]"
    expect(bar0.objectAt(1), m).eql({item : 2})

    m = "initial bar[2]"
    expect(bar0.objectAt(2), m).eql({item : 3})

    myObj.set('foo', A([{baz : 1}, {baz : 3}, {baz : 4}, {baz : 4}]))
    const bar1 = myObj.get('bar')

    m = "bar length after update"
    expect(bar1, m).length(4)

    m = "bar[0] after update"
    expect(bar1.objectAt(0), m).eql({item : 1})

    m = "bar[1] after update"
    expect(bar1.objectAt(1), m).eql({item : 3})

    m = "bar[2] after update"
    expect(bar1.objectAt(2), m).eql({item : 4})

    m = "bar[3] after update"
    expect(bar1.objectAt(3), m).eql({item : 4})

    m = "bar[0] should stay the same"
    expect(bar0.objectAt(0), m).equal(bar1.objectAt(0))

    m = "bar[2] should move to bar[1]"
    expect(bar0.objectAt(2), m).equal(bar1.objectAt(1))

    m = "bar[2] should be the same as bar[3]"
    expect(bar1.objectAt(2), m).equal(bar1.objectAt(3))

    myObj.get('foo').pushObject({baz : 2})
    const bar2 = myObj.get('bar')

    m = "after pushing `2` back: old bar[1] should NOT be the same as new bar[4]"
    expect(bar0.objectAt(1), m).not.equal(bar2.objectAt(4))
  })

  it('mapExistingByKey, dynamic key', function () {
    const MyObj = EObject.extend({
      bar : mapExistingByKey('foo', 'keyProp', function (item) {
        const key = this.get('keyProp')
        return {item : item[key]}
      }),
      keyProp : 'baz'
    })

    const myObj = MyObj.create({foo : A([{baz : 1}, {baz : 2}, {baz : 3}])})
    const bar0 = myObj.get('bar')

    m = "initial bar length"
    expect(bar0, m).length(3)

    m = "initial bar[0]"
    expect(bar0.objectAt(0), m).eql({item : 1})

    m = "initial bar[1]"
    expect(bar0.objectAt(1), m).eql({item : 2})

    m = "initial bar[2]"
    expect(bar0.objectAt(2), m).eql({item : 3})

    myObj.set('foo', A([{baz : 1}, {baz : 3}, {baz : 4}, {baz : 4}]))
    const bar1 = myObj.get('bar')

    m = "bar length after update"
    expect(bar1, m).length(4)

    m = "bar[0] after update"
    expect(bar1.objectAt(0), m).eql({item : 1})

    m = "bar[1] after update"
    expect(bar1.objectAt(1), m).eql({item : 3})

    m = "bar[2] after update"
    expect(bar1.objectAt(2), m).eql({item : 4})

    m = "bar[3] after update"
    expect(bar1.objectAt(3), m).eql({item : 4})

    m = "bar[0] should stay the same"
    expect(bar0.objectAt(0), m).equal(bar1.objectAt(0))

    m = "bar[2] should move to bar[1]"
    expect(bar0.objectAt(2), m).equal(bar1.objectAt(1))

    m = "bar[2] should be the same as bar[3]"
    expect(bar1.objectAt(2), m).equal(bar1.objectAt(3))

    myObj.get('foo').pushObject({baz : 2})
    const bar2 = myObj.get('bar')

    m = "after pushing `2` back: old bar[1] should NOT be the same as new bar[4]"
    expect(bar0.objectAt(1), m).not.equal(bar2.objectAt(4))

    myObj.setProperties({
      foo     : A([{baz : 1, quux : 2}]),
      keyProp : 'quux'
    })

    m = "after changing key property"
    expect(myObj.get('bar.firstObject'), m).eql({item : 2})
  })
})
