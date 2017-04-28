# ember-zen

A state management framework for Ember that brings calm confidence into app/addon development.


## The problem

Traditional Ember apps have their state scattered across countless mutable objects. When an app enter an inconsistent state due to a bug, you only see the resulting state. You don't see the sequence of events that caused the app assume that state, nor do you have a log of previous states.

As a result, it often takes hours, sometimes days, to figure out how and why your app enters an inconsistent state.

## Redux to the rescue... or not?

The glorious [Redux](http://redux.js.org/) is the most popular solution to this problem (in general, not specifically with Ember):

* Redux keeps all the state in a single JSON-like structure.
* The state is passive, it has no methods on it. The state can only be updated by calling centralized Redux actions.
* Each update produces a new state tree.
* If you log actions and resulting states (or simply use Redux DevTools), you get a whole picture of what happens to your app.
* "Time travel" is available out of the box: just pull a slider to see how your app state evolved in time. Undo/redo functionality can be implemented with little effort.
* Your business logic is separated from UI. You can test it effortlessly without having to mock stuff, and those tests are blazing fast because they don't need DOM. (That's not an excuse not to write acceptance tests, though.)

When you learn Redux virtues for the first time, you start wondering how you lived without it all these years.

But when you look deeper into Redux, you learn that:

* Because of the immutable pattern used in Redux, when you update a property on the state, its parent object and all its parents up to the tree root will be reinstantiated. As a result, state updates aren't cheap.
* If you simply feed the state tree into the tree of UI components, every tiny of the state will cause all the UI to rerender.
* To avoid that, you need to wrap component(s) with a special ["container" component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0). Regular components (the ones being wrapped) are called "presentational" components. The container component has a `mapStateToProps` function which is called every time the state is updated. `mapStateToProps` is responsible for extracting from the state only the properties related to given component. As a result, presentational components rerender only when related properties update, not when their parents on the state tree update. But `mapStateToProps` is called for all state updates, even unrelated to the component.
* Computed properties, which are called *selectors* in the Redux ecosystem, invalidate by observing dependent values, not keys. As a result, they can't be lazy: if your `mapStateToProps` passes a certain selector into a component, this selector (and all its selector dependencies) will be calculated the moment your container component initializes — even though the selector's value may never be actually accessed. You can avoid that by using imperative-style logic in `mapStateToProps`, or write some other glue code to deal with the problem.
* The same problem exists when you want to have computed properties on your records. For example, a post may have a computed property that calculates some linguistic analytics of post body. In Redux, attaching selectors to data is not a common practice: selectors are typically attached to components. This means that when you revisit a page, its components will be reinitialized and all their selectors will recompute. You don't want that: the analytics should compute once per data entry, not once for every UI representation of the same data.
* It is possible to keep compouted properties on records with [reselect-map](https://github.com/HeyImAlex/reselect-map). But `reselect-map` selectors are computed eagerly for all items in a collection, even if you render only one of them. Even worse, when you update a property on an item, all its selectors will recompute, even if they don't depend on the updated property.
* Another solution is [re-reselect](https://github.com/toomuchdesign/re-reselect). This lib fiercely caches every combination of arguments and resulting values, without providing any strategy for invalidating the cache. You are supposed to figure it out yourself, which implies lots of boilerplate code and susceptibility to bugs.
* Focusing on writing glue code by hand is something that you'll find yourself doing a lot. A seasoned Ember developer, used to concentrating on business logic, may find this ridiculous.

The [ember-redux](http://www.ember-redux.com/) addon inherits these features. Though reasonable in the React/Redux ecosystem, they make little sense in Ember. That's because Ember is more sophisticated than React:
 
* Ember has bindings that let it directly update a specific DOM node when a bound property changes.
* Ember computed properties observe keys, not values, so they can be lazy: a CP doesn't compute until it is actually accessed.
* Ember aims at saving you from writing a lot of boilerplate code and letting you focus on features.
* Ember has a native server-side rendering solution. In order to render HTML on the backend, you don't have to sacrifice deep integration between the framework and a state management system.

Zen attempts to offer the virtues of centralized state management while avoiding the problems described above.



## Zen design

* Zen state tree is composed of *nodes*.
* Nodes are Ember-driven objects. Their properties can be used in templates directly, computed properties can depend on their keys.
* Nodes are mutable, but they should only be updated through the Zen pipeline by dispatching an action.
* Actions are kept directly on nodes, similar to Ember components. In an action, you can simply to normal `this.set(key, value)`.
* And like with components, actions aren't called directly. They are dispatched either with a template helper or a special method. This allows dispatching all actions in a centralized way, letting you hook to state updates, e. g. log them or stash state snapshots.
* Any tree of nodes is a state tree. Like in Redux, it's recommended to have one global state tree per app, kept on the Zen service, but that's not a requirement. You can have as many state trees as your best judgement tells you to.
* Ember addons can use Zen to manage internal state of addon components. The host app is not required to be Zen-driven. But if it is, then the state trees of addon components can be attached to the app's global state tree!
* There's no division of components into container and presentational ones. With Zen, all Ember components are presentational, and the Zen service is not supposed to be injected into them. Your app interacts with Zen on the controller level. Components are blissfully unaware of Zen, they receive Zen state and actions as regular properties and closure actions.
* Zen nodes can have computed properties on them, just like Ember Data models. But unlike them, nodes should not contain any logic other than actions that update nodes' own state synchronously. Zen does not have "async action creators" like [redux-thunk](https://github.com/gaearon/redux-thunk). Instead, you are encouraged to keep such logic in Ember controllers, routes or services, depending on situation. [ember-concurrency](https://ember-concurrency.com) is your friend but it's outside of Zen scope.


    
## Comparison with Redux

|                                              | Redux                                                                                                                                                                                | Zen                                                                                                                                                                                                               |
|:---------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Updating a property on the state tree        | :broken_heart: Expensive. When a property is updated, all its parents in the state tree are reinitialized. Every state update triggers `mapStateToProps` on *all* active components. | :green_heart: Cheap. Although `Ember.set(foo, 'bar', baz)` is not as cheap as `foo.bar = baz`, is applied directly, without unnecessary reinitializations or comparisons.                                         |
| Making a snapshot of the state               | :green_heart: Zero cost. The cost is being paid during state updates.                                                                                                                | :broken_heart: Expensive. Have to serialize the whole tree.                                                                                                                                                       |
| Populating a snapshot back into the state    | :yellow_heart: No more expensive than a usual update. `mapStateToProps` prevents components from rerendering unnecessarily.                                                          | :broken_heart: Expensive. Have to populate the snapshot tree into the state tree recursively. Depending on upcoming implementation, may cause the whole UI to rerender.                                           |
| Snapshot memory size                         | :green_heart: Efficient. No duplicates are stored thanks to the immutable pattern — even if you don't use a library for immutability.                                                | :broken_heart: Inefficient. A collection of snapshots stores tons of duplicate data.                                                                                                                              |
| Computed properties                          | :broken_heart: Eager. `reselect-map` is very expensive. `re-reselect` is a memory eater, unless you implement custom cache invalidation which is never easy.                         | :green_heart: Lazy, efficient.                                                                                                                                                                                    |
| Amount of boilerplate code you have to write | :broken_heart: Lots.                                                                                                                                                                 | :green_heart: More than with conventional OOP Ember (especially with two-way bindings which are discouraged but super quick to code), but substantially less than with Redux.                                     |
| Usage in Ember apps                          | :broken_heart: Have to mix Redux FP style with Ember OOP.                                                                                                                            | :green_heart: Seamless. Use computed properties on state tree nodes as you normally would on components or Ember Data models.                                                                                     |
| Usage in Ember addons                        | :broken_heart: Using Redux to manage the internal state of addon components is impossible or at least quite problematic.                                                             | :green_heart: Any addon can have its internal state managed by `ember-shelf`. Just pass a parent node into such component and it will attach its state to that node, making it part of the host app's state tree. |
| Cognitive load for an Ember dev              | :broken_heart: So much to grasp. No industry standard codebase structure. Lots of stuff is supposed to be figure out on your own.                                                    | :yellow_heart: Not recommended for an Ember newbie, but to an experienced Ember dev it's a longed-for relief.                                                                                                     |

