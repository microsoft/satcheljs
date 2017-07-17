import 'jasmine';
import action from '../lib/action';
import select from '../lib/select';
import createStore from '../lib/createStore';
import { initializeTestMode, resetTestMode } from '../lib/testMode';
import { getActionType } from '../lib/functionInternals';

describe('select', () => {
    it('creates a state scoped to subset of state tree', () => {
        let fooStore = createStore('foo', {
            key1: 'value1',
            obj1: {
                obj1Key1: 'obj1_value1',
                obj1Key2: 'obj1_value2',
            },
            array1: ['array1_value1', 'array1_value2'],
        });

        interface ReadOnlyActionState {
            key1: string;
            obj1Key1: string;
            obj1: any;
            array1: string[];
            array1Value1: string;
        }

        let readOnlyAction = jasmine.createSpy(
            'action',
            action('readOnly')((state?: ReadOnlyActionState) => {
                expect(state.key1).toBe(fooStore.key1);
                expect(state.obj1Key1).toBe(fooStore.obj1.obj1Key1);
                expect(state.obj1).toBe(fooStore.obj1);
                expect(state.array1).toBe(fooStore.array1);
                expect(state.array1Value1).toBe(fooStore.array1[0]);
            })
        );

        let newAction = select({
            key1: () => fooStore.key1,
            obj1Key1: () => fooStore.obj1.obj1Key1,
            obj1: () => fooStore.obj1,
            array1: () => fooStore.array1,
            array1Value1: () => fooStore.array1[0],
        })(readOnlyAction);

        newAction();

        expect(readOnlyAction).toHaveBeenCalledTimes(1);
    });

    it('propagates action params to the selector function', () => {
        let fooStore: any = createStore('foo', {
            id0: 'value',
            array0: ['a', 'b', 'c'],
        });

        let readAction = action('read')(function readAction(
            id: string,
            arrayIndex: number,
            state?: any
        ) {
            expect(state.value).toBe('value');
            expect(state.arrayValue).toBe('c');
        });

        let newAction = select({
            value: (id: string, arrayIndex: number) => fooStore[id],
            arrayValue: (id: string, arrayIndex: number) => fooStore.array0[arrayIndex],
        })(readAction);

        newAction('id0', 2);
    });

    it('places state at the right argument position even if the wrapped function has optional arguments before state', () => {
        let fooStore: any = createStore('foo', {
            key: 'value',
        });

        let someAction = action(
            'someAction'
        )((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('value');
            expect(optional).not.toBeDefined();
            expect(required).toBe('required value');
        });

        let newAction = select({
            key: () => fooStore.key,
        })(someAction);

        newAction('required value');
    });

    it('can handle having action be the outer decorator', () => {
        let fooStore: any = createStore('foo', {
            key: 'value',
        });

        let functionIsCalled = false;

        let someAction = select({
            key: () => fooStore.key,
        })((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('value');
            expect(optional).not.toBeDefined();
            expect(required).toBe('required value');
            functionIsCalled = true;
        });

        let newAction = action('action')(someAction);

        newAction('required value');

        expect(functionIsCalled).toBeTruthy();
    });

    it('allows tests to passthrough state param', () => {
        let fooStore: any = createStore('foo', {
            key: 'value',
        });

        let someAction = select({
            key: () => fooStore.key,
        })((required: string, optional?: string, state?: any) => {
            expect(state.key).toBe('testValue');
            expect(optional).toBe('optional');
            expect(required).toBe('required value');
        });

        let newAction = action('action')(someAction);

        newAction('required value', 'optional', { key: 'testValue' });
    });

    it('can use new TS 2.1 mapped types to describe selector functions', () => {
        let fooStore = createStore('foo', {
            k: 'v',
        });

        interface ActionState {
            key: string;
        }

        let updateAction = action('update')((state?: ActionState) => {
            expect(state.key).toBe(fooStore.k);
        });

        let newAction = select<ActionState>({
            key: () => fooStore.k,
        })(updateAction);

        newAction();
    });

    it('does not execute the selector function in test mode', () => {
        initializeTestMode();

        let fooSelector = jasmine.createSpy('fooSelector');
        let actionSpy = jasmine.createSpy('action');

        select({
            foo: fooSelector,
        })(actionSpy)();

        expect(fooSelector).not.toHaveBeenCalled();
        expect(actionSpy).toHaveBeenCalled();

        resetTestMode();
    });

    it('does execute the selector function after test mode has been cleared', () => {
        initializeTestMode();
        resetTestMode();

        let fooSelector = jasmine.createSpy('fooSelector').and.returnValue('fooValue');
        let action = (state?: any) => {
            expect(state.foo).toBe('fooValue');
        };

        select({
            foo: fooSelector,
        })(action)();

        expect(fooSelector).toHaveBeenCalled();
    });

    it('when wrapping an action, preserves the action type', () => {
        // Arrange
        let actionName = 'testAction';
        let testAction = action(actionName)(() => {});

        // Act
        let wrappedAction = select({})(testAction);

        // Assert
        expect(getActionType(wrappedAction)).toBe(actionName);
    });
});
