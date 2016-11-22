# `@reactive`

The @reactive decorator is an ES7 decorator that turns an ordinary React component into a reactive one that can:

1. observe changes and re-render with the help of mobx's @observer decorator
2. take in a selector function to allow components to be scoped to a sub-part of the state tree allowing components to be pure

The selector, if passed into the decorator, is an object that contains lazy-evaluated getter for sub-part of the observable state tree 
that gets stuffed inside the component's props. 

Note: this decorator differs from `select` in that it decorates React.Components. It also only stuffs the props with read-only getters off of state tree

## Usage

### ES6 class components ###
**`@reactive(selector) class Component extends React.Component<any, any> { ... }`**

### For stateless, functional components ###
**`reactive(selector)((props: any) => ...)`**

* `selector` is an object where the keys are strings and the values are small accessor (or cursor) into the state tree. 

## Examples

### Simple Example
```typescript
@reactive
class Foo extends React.Component { ... }

// Foo is now an @observer
```

### Accessing selected subtree via props
Parts of the state tree are selected and placed inside the props

```typescript
@reactive({
    foo: () => store.foo,
    bar: () => store.bar
})
class Foo extends React.Component { 
    render() {
        let {foo, bar} = this.props;
        return <div>{foo + " " + bar}</div>;
    }
}

// both foo and bar are accessed as props
```

### Using "real" props inside selector
Sometimes it is necessary to access a certain part of the store based on the passed in props

```typescript
@reactive({
    item: (props) => store.items[props.id]
})
class Foo extends React.Component { 
    render() {
        let {item} = this.props;
        return <div>{item.name}</div>;
    }
}
```

### Write a test for an action function
```typescript
import Foo from "../components/Foo";
import {shallow} from 'enzyme';

describe("an enzyme test", () => {
    it("should be able to do shallow render tests", () => {
        let item = {
            name: 'myName'
        };

        let wrapper = shallow(
            <Foo item={item} />
        );

        expect(wrapper.find(...)).toBeTruthy();

        // Note: @reactive actually creates a higher-order component, and shallow render will actually be rendering that
        // Therefore, it is necessary to use the "find" instead of "contains" to check for presence of elements
    });
});
```