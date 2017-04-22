# ember-shelf

`ember-shelf` is a state management framework for Ember.

It's goal is to introduce the virtues of Redux to Ember, while staying true to the Ember way and avoiding extra work both in terms of app performance and the amount of code you have to write.



## Why

Traditional Ember apps store their state scattered across countless mutable objects. When there's a bug in business logic, it often takes hours, sometimes days, to figure out how and why your app enters an inconsistent state.

The most popular solution to this problem (in general, not specifically with Ember) is the glorious [Redux](http://redux.js.org/):

* Redux keeps all state in a single JSON-like structure.
* State is passive, it has no methods on it. State can only be updated by calling centralized Redux actions.
* Each update produces a new state.
* If you log actions and resulting states (or simply use Redux DevTools), you get a whole picture of what happens to your app.
* "Time travel" is available out of the box; undo/redo functionality can be implemented with little effort.
* Your business logic is separated from UI. You can test it effortlessly without having to mock stuff, and those tests are blazing fast because they don't need DOM. (That's not an excuse not to write acceptance tests, though.)

When learn Redux virtues for the first time, you start wondering how you lived without it all these years. :trollface:

But when you look deeper into Redux, you learn that:

* Because of the immutable pattern used in Redux, when you update a property on the state, its parent object and all its parents up to the tree root will be reinstantiated.
* Thus, if you simply feed the state tree into the tree of UI components, any tiny of the state will cause all the UI to rerender.
* To avoid that, you need to wrap component(s) with a special ["container" component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). Regular components (the ones being wrapped) are called "presentational" components. The container component has a `mapStateToProps` function which runs every time the state is updated. `mapStateToProps` is responsible for extracting from the state only the properties related to given component. As a result, presentational components rerender only when related properties update, not when their parents on the state tree update.
* Computed properties, which are called *selectors* in the Redux ecosystem, invalidate by observing dependent values, not keys. As a result, they can't be lazy: if your `mapStateToProps` passes a certain selector into a component, this selector (and all its selector dependencies) will be calculated the moment your container component initializes — even though the selector's value may never be actually accessed. You can only avoid that by using imperative-style logic in `mapStateToProps`.
* The same is true when you want to have computed properties on your records. For example, a post may have a computed property that calculates some linguistic analytics of post body. In Redux, attaching selectors to data is not a common practice: selectors are typically attached to components. This means that when you revisit a page, its components will be reinitialized and all their selectors will recompute. You don't want that: the analytics should compute once per data entry, not once for every UI representation of the same data. It is possible in Redux with [reselect-map](https://github.com/HeyImAlex/reselect-map). But `reselect-map` selectors are computed eagerly for all items in a collection, even if you render only one of them. Even worse, when you update a property on an item, all its selectors will recompute, even if they don't depend on the updated property.
* Redux is intentionally fully abstracted from the view layer, so that your code can be extracted from your app to implement server-side rendering. As a result, you you have to write quite a lot of boilerplate code by hand, 

The [ember-redux](http://www.ember-redux.com/) addon inherits those disadvantages. But they make little sense in Ember because Ember is smarter than React. Ember has bindings that let it directly update the UI when a bound property changes. Ember computed properties observe keys, not values, so they can be lazy: a CP doesn't compute until it is actually accessed. Ember aims at saving you from writing much boilerplate code and letting you concentrate on business logic. Ember supports server-side rendering, so you can benefit from having your state management framework deeply integrated with Ember.

`ember-shelf` attempts to offer the virtues of centralized state management while avoiding the problems described above.



## How

* `ember-shelf` state tree is composed of *nodes*.
* Nodes are Ember-driven objects. They can be used in templates directly, computed properties can depend on their keys.
* Nodes are mutable, but they should only be updated through the `ember-shelf` pipeline by dispatching an action.
* As nodes are updated through `ember-shelf`, it can react to updates, e. g. log them or stash state snapshots.
* Properties on a node can be: simple, serializable and non-serializable.
  * Simple properties contain data of types supported by JSON: number, string, boolean, array, object and null. When `ember-state` makes a snapshot of the state, such properties are simply copied over.
  * Serializable properties contain data that can be serialized and deserialized with `ember-shelf` middleware. For example, you can store dates with mutable [Moment.js](https://momentjs.com/) instances. When making a snapshot of the state, `ember-state` calls corresponding middleware on serializable properties in order to serialized them. A Moment instance can be serialized into a number of milliseconds or an ISO string for readability. When loading a snapshot back into the state, `ember-state` will ask the middleware to instantiate serialized data back into a Moment instance.
  * Non-serializable properties are:
    * Non-enumerable properties.
    * Ember internal properties not related to the state. `ember-state` has a list of keys to ignore.
    * Computed properties! You can use regular Ember computed properties (including [awesome macros](https://github.com/kellyselden/ember-awesome-macros) and such)!
    * Non-serializable instances. Some third-party SDK may provide its own OOP instances to work with. You can store those on `ember-shelf` nodes, but if you don't provide middleware to serialize/deserialize them, you will lose corresponding benefits of `ember-state`. Prefix such properties with `$` or `_`, so that `ember-shelf` ignores them and doesn't crash during serialization.
    
    
## Comparison with Redux

|                                              | Redux                                                                                                                                                                                | `ember-shelf`                                                                                                                                                                                                     |
|:---------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Updating a property on the state tree        | :broken_heart: Expensive. When a property is updated, all its parents in the state tree are reinitialized. Every state update triggers `mapStateToProps` on *all* active components. | :green_heart: Cheap. `Ember.set(foo, 'bar', baz)` is not as cheap as `foo.bar = baz`, but is applied directly, with no unnecessary reinitializations or comparisons.                                              |
| Making a snapshot of the state               | :green_heart: Zero cost. The cost is being paid during state updates.                                                                                                                | :broken_heart: Expensive. Have to serialize the whole tree.                                                                                                                                                       |
| Populating a snapshot back into the state    | :yellow_heart: Not more expensive than a usual update. `mapStateToProps` prevents components from rerendering unnecessarily.                                                         | :broken_heart: Expensive. Have to populate the snapshot tree into the state tree recursively.                                                                                                                     |
| Snapshot memory size                         | :green_heart: Efficient. No duplicates are stored thanks to the immutable pattern — even if you don't use a library for immutability.                                                | :broken_heart: Inefficient. A collection of snapshots stores tons of duplicate data.                                                                                                                              |
| Computed properties                          | :broken_heart: Eager. `reselect-map` is very expensive.                                                                                                                              | :green_heart: Lazy, efficient.                                                                                                                                                                                    |
| Amount of boilerplate code you have to write | :broken_heart: Lots.                                                                                                                                                                 | :green_heart: Little.                                                                                                                                                                                             |
| Usage in Ember apps                          | :broken_heart: Have to mix Redux FP style with Ember OOP.                                                                                                                            | :green_heart: Seamless. Use computed properties on state tree nodes as you normally would on components or Ember Data models.                                                                                     |
| Usage in Ember addons                        | :broken_heart: Using Redux to manage the internal state of addon components is impossible or at least quite problematic.                                                             | :green_heart: Any addon can have its internal state managed by `ember-shelf`. Just pass a parent node into such component and it will attach its state to that node, making it part of the host app's state tree. |

## Installation

* `git clone <repository-url>` this repository
* `cd ember-shelf`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
