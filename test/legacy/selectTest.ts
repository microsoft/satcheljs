import 'jasmine';
import {map, ObservableMap} from 'mobx';
import action from '../../src/legacy/action';
import select from '../../src/legacy/select';
import createStore from '../../src/createStore';
import {initializeTestMode, resetTestMode} from '../../src/legacy/testMode';
import { getActionType } from '../../src/legacy/functionInternals';

describe("select", () => {
    it("creates a state scoped to subset of state tree", () => {
        let fooStore = createStore('foo', {
            key1: 'value1',
            obj1: {
                obj1Key1: 'obj1_value1',
                obj1Key2: 'obj1_value2',
            },
            array1: ['array1_value1', 'array1_value2']
        });

        interface ReadOnlyActionState {
            key1: string,
            obj1Key1: string,
            obj1: any,
            array1: string[],
            array1Value1: string
        };

        let readOnlyAction = action("readOnly")((state?: ReadOnlyActionState) => {
            expect(state.key1).toBe(fooStore.key1);
            expect(state.obj1Key1).toBe(fooStore.obj1.obj1Key1);
            expect(state.obj1).toBe(fooStore.obj1);
            expect(state.array1).toBe(fooStore.array1);
            expect(state.array1Value1).toBe(fooStore.array1[0]);
        });

        let newAction = select({
            key1: () => fooStore.key1,
            obj1Key1: () => fooStore.obj1.obj1Key1,
            obj1: () => fooStore.obj1,
            array1: () => fooStore.array1,
            array1Value1: () => fooStore.array1[0]
        })(readOnlyAction);

        newAction();
    });

    it("can update observable value", () => {
        let fooStore = createStore('foo', {
            k: 'v',
        });

        interface ActionState {
            key: string,
        };

        let updateAction = action("update")((state?: ActionState) => {
            expect(state.key).toBe(fooStore.k);
            state.key = 'newValue';
        });

        let newAction = select({
            key: () => fooStore.k,
        })(updateAction);

        newAction();

        expect(fooStore.k).toBe('newValue');
    });

    it("can update observable map", () => {
        let fooStore = createStore('foo', {
            map: map({k: 'v'})
        });

        interface ActionState {
            map: ObservableMap<string>,
        };

        let updateAction = action("update")((state?: ActionState) => {
            state.map.set('k', 'newValue');
        });

        let newAction = select({
            map: () => fooStore.map,
        })(updateAction);

        newAction();

        expect(fooStore.map.get('k')).toBe('newValue');
    });

    it("can update observable arrays", () => {
        let fooStore = createStore('foo', {
            array: ['v']
        });

        interface ActionState {
            array: string[],
        };

        let updateAction = action("update")((state?: ActionState) => {
            state.array.push('newValue');
        });

        let newAction = select({
            array: () => fooStore.array,
        })(updateAction);

        newAction();

        expect(fooStore.array[0]).toBe('v');
        expect(fooStore.array[1]).toBe('newValue');
        expect(fooStore.array.length).toBe(2);
    });

    it("can update atoms", () => {
        let fooStore = createStore('foo', {
            array: ['v']
        });

        interface ActionState {
            array: string[],
        };

        let updateAction = action("update")((state?: ActionState) => {
            state.array[0] = 'newValue';
        });

        let newAction = select({
            array: () => fooStore.array,
        })(updateAction);

        newAction();

        expect(fooStore.array[0]).toBe('newValue');
        expect(fooStore.array.length).toBe(1);
    });

    it("can update properties of an observable object", () => {
        let fooStore = createStore('foo', {
            obj: {
                k: 'v'
            }
        });

        interface ActionState {
            obj: {[key: string]: string},
        };

        let updateAction = action("update")((state?: ActionState) => {
            state.obj['k'] = 'newValue';
        });

        let newAction = select({
            obj: () => fooStore.obj,
        })(updateAction);

        newAction();

        expect(fooStore.obj.k).toBe('newValue');
    });

    it("propagates action params to the selector function", () => {
        let fooStore: any = createStore('foo', {
            id0: 'value',
            array0: ['a', 'b', 'c']
        });

        let readAction = action("read")(function readAction(id: string, arrayIndex: number, state?: any) {
            expect(state.value).toBe('value');
            expect(state.arrayValue).toBe('c');
        });

        let newAction = select({
            value: (id: string, arrayIndex: number) => fooStore[id],
            arrayValue: (id: string, arrayIndex: number) => fooStore.array0[arrayIndex]
        })(readAction);

        newAction('id0', 2);
    });

    it("places state at the right argument position even if the wrapped function has optional arguments before state", () => {
        let fooStore: any = createStore('foo', {
            key: 'value'
        });

        let someAction = action("someAction")((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('value');
            expect(optional).not.toBeDefined();
            expect(required).toBe('required value');
        });

        let newAction = select({
            key: () => fooStore.key
        })(someAction);

        newAction('required value');
    });

    it("can handle having action be the outer decorator", () => {
        let fooStore: any = createStore('foo', {
            key: 'value'
        });

        let functionIsCalled = false;

        let someAction = select({
            key: () => fooStore.key
        })((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('value');
            expect(optional).not.toBeDefined();
            expect(required).toBe('required value');
            functionIsCalled = true;
        });

        let newAction = action("action")(someAction);

        newAction('required value');

        expect(functionIsCalled).toBeTruthy();
    });

    it("allows tests to passthrough state param", () => {
        let fooStore: any = createStore('foo', {
            key: 'value'
        });

        let someAction = select({
            key: () => fooStore.key
        })((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('testValue');
            expect(optional).toBe('optional');
            expect(required).toBe('required value');
        });

        let newAction = action("action")(someAction);

        newAction('required value', 'optional', {key: 'testValue'});
    });

    it("can use new TS 2.1 mapped types to describe selector functions", () => {
        let fooStore = createStore('foo', {
            k: 'v',
        });

        interface ActionState {
            key: string;
        }

        let updateAction = action("update")((state?: ActionState) => {
            expect(state.key).toBe(fooStore.k);
            state.key = 'newValue';
        });

        let newAction = select<ActionState>({
            key: () => fooStore.k,
        })(updateAction);

        newAction();

        expect(fooStore.k).toBe('newValue');
    });

    it("does not execute the selector function in test mode", () => {
        initializeTestMode();

        let fooSelector = jasmine.createSpy(null);
        let actionSpy = jasmine.createSpy('action');

        select({
            foo: fooSelector
        })(actionSpy)();

        expect(fooSelector).not.toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();

        resetTestMode();
    });

    it("does execute the selector function after test mode has been cleared", () => {
        initializeTestMode();
        resetTestMode();

        let fooSelector = jasmine.createSpy(null);
        let actionSpy = jasmine.createSpy('action');

        select({
            foo: fooSelector
        })(actionSpy)();

        expect(fooSelector).toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();
    });

    it("when wrapping an action, preserves the action type", () => {
        // Arrange
        let actionName = "testAction";
        let testAction = action(actionName)(() => {});

        // Act
        let wrappedAction = select({})(testAction);

        // Assert
        expect(getActionType(wrappedAction)).toBe(actionName);
    });
});
