## Asynchronous actions

Often actions will need to do some sort of asynchronous work (such as making a server request) and then update the state based on the result.
Since the asynchronous callback happens outside of the context of the original action the callback itself must be an action too.

```typescript
let updateFooAsync =
	function updateFooAsync(newFoo: number) {
		// You can modify the state in the original action
		myStore.loading = true;

		// doSomethingAsync returns a promise
		doSomethingAsync().then(
			action("doSomethingAsyncCallback")(
				() => {
					// Modify the state again in the callback
					myStore.loading = false;
					myStore.foo = newFoo;
				}));
	};

updateFooAsync = action("updateFooAsync")(updateFooAsync);
```
