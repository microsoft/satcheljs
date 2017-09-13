# MobX

Satchel is built on top of [MobX](https://github.com/mobxjs/mobx), which greatly simplifies state management and how that state gets reflected in the view.
However, MobX does have a few gotchas, so it's worth acquainting yourself with the [documentation](https://mobx.js.org/), especially the [pitfalls and best practices secion](https://mobx.js.org/best/pitfalls.html).
A few highlights:

* **MobX cannot observe new properties being *added* to an object**.
  You should always initialize all your store properties, even if it is just to `null`.
  By the same token, if you need a dictionary you should use a [`map`](https://mobx.js.org/refguide/map.html) type.

* **Only dereference store values in the component where they are actually needed.**
  This allows MobX to accurately track what needs to be rerendered when the value changes.

* **Consider using [`computed`](https://mobx.js.org/refguide/computed-decorator.html) on selector functions.**
  This has two major benefits: it avoids recomputing a value if none of the underlying data has changed,
  and if the underlying data *does* change but the resultant value is the same, it avoids rerendering any view that depends on that value.
