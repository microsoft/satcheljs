function createV4Store(mutators: any) {}
function action(name: string): any {}
function createReducer<T>(...args: any[]): any {}
function createMockAction(...args: any[]): any {}

const actionA = action('a');
const actionB = action('b');

// Simple scalar value
const reducer1 = createReducer<string>('x')
    .addReduction(actionA, (state, actionMessage) => {
        // Return value means we *replace* the state
        return 'a';
    })
    .addReduction(actionB, (state, actionMessage) => {
        return 'b';
    });

// Complex type
// Schema could live in same file as it's associated reducer
const reducer2 = createReducer<any>({
    someValue: 'x',
}).addReduction(actionA, (state, actionMessage) => {
    // No return value means that we've mutated the draft state
    state.someValue = 'a';
});

// Shape of store is inferred from reducers
const getStore = createV4Store({
    value1: reducer1,
    value2: reducer2,
});

// TODO: Is there ever a case where we'd want to compose reducers in some custom way?
// Probably it's a good thing that we force a shallow structure.

// The store would do this, reducer would handle (or ignore) action
reducer1.giveAction({ thisIsAnAction: true });

// Test cases could do the same; just need a good way to create a mock action (satcheljs/testUtils)
let mockAction = createMockAction(actionA, { payloadGoesHere: true });
reducer1.dispatchAction(mockAction);

// Or better yet, if TS isn't too annoying about the typing:
actionA.create(1, 2, 3);
// ...but this probably will require all actionc reator files to rexport some satchel typings
