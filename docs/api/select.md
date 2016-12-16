# `select`

When developing an application with a state tree, it is often desirable to scope an action to certain sub-parts of the state tree. When an action is focused on
a subtree, the action becomes more readable and easier to test.

The select functional decorator can be used in conjunction with the `action` function decorator. The selected state passed into the function is actually read and write enabled, 
so it enables the developer to update sub-part of the state tree as well.  

## Usage

**`select(selector)(fn)`**

* `selector` is an object where the keys are strings and the values are small accessor (or cursor) into the state tree. 
* `fn` is the function to convert to an action.  It can take any parameter as arguments and should return either `void` or a `Promise` (if it does some async work).

## Examples

### Simple Example
```typescript
let store = createStore("myStore", {
    key: 'oldValue'
});

let setValue = action("setValue")(
    select({
        myKey: () => store.key 
    })(function setValue(newValue: string, state?: any) {
        state.myKey = newValue;
    }));

setValue("newValue"); // After this, store.key would contain the 'newValue' string
```

### Accessing function arguments inside selector
```typescript
let store = createStore("myStore", {
    someArray: ['first', 'second', 'third']
});

let setValue = action("setValue")(
    select({
        myItem: (index: number) => store.someArray[index] 
    })(function setValue(index: number, newValue: string, state?: any) {
        state.myItem = newValue;
    }));

setValue(1, "newValue"); // After this, store.someArray[1] would contain the 'newValue' string
```

### Write a test for an action function
```typescript
/**
 * setValue.ts
 */
export default action("setValue")(
    select({
        myKey: () => store.key 
    })(function setValue(newValue: string, state?: any) {
        state.myKey = newValue;
    }));

/**
 * setValue.spec.ts
 */
import setValue from "../actions/setValue";
import {initializeTestMode, resetTestMode} from "satcheljs";

describe("a jasmine test", () => {
    beforeAll(() => {
        initializeTestMode(); // this disables any calls to selector functions during test
    });

    afterAll(() => {
        resetTestMode(); // this turns off the test mode for selectors
    });
    
    it("should be able to test actions", () => {
        let state = { key: 'oldValue' };
        setValue('newValue', state);
        expect(state.key).toBe('newValue');
    });
});
```