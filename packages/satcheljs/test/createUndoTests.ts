import 'jasmine';
import action from '../lib/action';
import createUndo, { UndoResult } from '../lib/createUndo';
import { extendObservable, observable, map, _ } from 'mobx';
import initializeState from '../lib/initializeState';
import { __resetGlobalContext } from '../lib/globalContext'

function resetState() {
    _.resetGlobalState();
    initializeState({});
    __resetGlobalContext();
}

describe('createUndo', () => {

    beforeEach(resetState);

    describe('undo without verification', () => {

        beforeEach(resetState);

        it('undoes an update to an array', () => {
            let index = 1;
            let newValue = 5;
            let oldValue = 2;

            let array = observable([1, oldValue, 3]);
            let undoableAction = action('updateArray')(() => {array[index] = newValue});

            let undoResult = createUndo('updateArray')(undoableAction);

            expect(array[index]).toBe(newValue);

            undoResult();

            expect(array[index]).toBe(oldValue);
        });

        it('undoes an update to a map', () => {
            let index = 'key';
            let newValue = 5;
            let oldValue = 2;

            let object = map({key: oldValue});
            let undoableAction = action('updateMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('updateMap')(undoableAction);

            expect(object.get(index)).toBe(newValue);

            undoResult();

            expect(object.get(index)).toBe(oldValue);
        });

        it('undoes an update to an object', () => {
            let newValue = 5;
            let oldValue = 2;

            let object = observable({key: oldValue});
            let undoableAction = action('updateObject')(() => { object.key = newValue });

            let undoResult = createUndo('updateObject')(undoableAction);

            expect(object.key).toBe(newValue);

            undoResult();

            expect(object.key).toBe(oldValue);
        });

        it('undoes an array splice', () => {
            let object = observable([1, 2, 3, 4, 5, 6] as any[]);
            let undoableAction = action('spliceArray')(() => { object.splice(2, 3, 'a') });

            let undoResult = createUndo('spliceArray')(undoableAction);

            expect(object.slice(0)).toEqual([1, 2, 'a', 6]);

            undoResult();

            expect(object.slice(0)).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('undoes an add to a map', () => {
            let index = 'key';
            let newValue = 5;

            let object = map({});
            let undoableAction = action('addMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('addMap')(undoableAction);

            expect(object.get(index)).toBe(newValue);

            undoResult();

            expect(object.has(index)).toBeFalsy;
        });

        it('undoes an add to an object', () => {
            let index = 'key';
            let newValue = 5;

            let object: any = observable({});
            let undoableAction = action('addObject')(() => { extendObservable(object, {[index]: newValue}) });

            let undoResult = createUndo('addObject')(undoableAction);

            expect(object[index]).toBe(newValue);

            undoResult();

            expect(Object.getOwnPropertyNames(object)).not.toContain(index);
        });

        it('undoes a delete to a map', () => {
            let index = 'key';
            let oldValue = 5;

            let object = map({[index]: oldValue});
            let undoableAction = action('deleteMap')(() => { object.delete(index) });

            let undoResult = createUndo('deleteMap')(undoableAction);

            expect(object.has(index)).toBeFalsy;

            undoResult();

            expect(object.get(index)).toBe(oldValue);
        });
    });

    describe('undo with passing verification', () => {

        beforeEach(resetState);

        it('undoes an update to an array', () => {
            let index = 1;
            let newValue = 5;
            let oldValue = 2;

            let array = observable([1, oldValue, 3]);
            let undoableAction = action('updateArray')(() => {array[index] = newValue});

            let undoResult = createUndo('updateArray', true)(undoableAction);

            expect(array[index]).toBe(newValue);

            undoResult();

            expect(array[index]).toBe(oldValue);
        });

        it('undoes an update to a map', () => {
            let index = 'key';
            let newValue = 5;
            let oldValue = 2;

            let object = map({key: oldValue});
            let undoableAction = action('updateMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('updateMap', true)(undoableAction);

            expect(object.get(index)).toBe(newValue);

            undoResult();

            expect(object.get(index)).toBe(oldValue);
        });

        it('undoes an update to an object', () => {
            let newValue = 5;
            let oldValue = 2;

            let object = observable({key: oldValue});
            let undoableAction = action('updateObject')(() => { object.key = newValue });

            let undoResult = createUndo('updateObject', true)(undoableAction);

            expect(object.key).toBe(newValue);

            undoResult();

            expect(object.key).toBe(oldValue);
        });

        it('undoes an array splice', () => {
            let object = observable([1, 2, 3, 4, 5, 6] as any[]);
            let undoableAction = action('spliceArray')(() => { object.splice(2, 3, 'a') });

            let undoResult = createUndo('spliceArray', true)(undoableAction);

            expect(object.slice(0)).toEqual([1, 2, 'a', 6]);

            undoResult();

            expect(object.slice(0)).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('undoes an add to a map', () => {
            let index = 'key';
            let newValue = 5;

            let object = map({});
            let undoableAction = action('addMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('addMap', true)(undoableAction);

            expect(object.get(index)).toBe(newValue);

            undoResult();

            expect(object.has(index)).toBeFalsy;
        });

        it('undoes an add to an object', () => {
            let index = 'key';
            let newValue = 5;

            let object: any = observable({});
            let undoableAction = action('addObject')(() => { extendObservable(object, {[index]: newValue}) });

            let undoResult = createUndo('addObject', true)(undoableAction);

            expect(object[index]).toBe(newValue);

            undoResult();

            expect(Object.getOwnPropertyNames(object)).not.toContain(index);
        });

        it('undoes a delete to a map', () => {
            let index = 'key';
            let oldValue = 5;

            let object = map({[index]: oldValue});
            let undoableAction = action('deleteMap')(() => { object.delete(index) });

            let undoResult = createUndo('deleteMap', true)(undoableAction);

            expect(object.has(index)).toBeFalsy;

            undoResult();

            expect(object.get(index)).toBe(oldValue);
        });
    });

    describe('undo with failing verification', () => {

        beforeEach(resetState);

        it('throws an exception when it undoes an update to an array', () => {
            let index = 1;
            let newValue = 5;
            let oldValue = 2;

            let array = observable([1, oldValue, 3]);
            let undoableAction = action('updateArray')(() => {array[index] = newValue});

            let undoResult = createUndo('updateArray', true)(undoableAction);
            action('updateArray-again')(() => { array[index] = 100 })();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes an update to a map', () => {
            let index = 'key';
            let newValue = 5;
            let oldValue = 2;

            let object = map({key: oldValue});
            let undoableAction = action('updateMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('updateMap', true)(undoableAction);
            action('updateMap-again')(() => { object.set(index, 100) })();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes an update to an object', () => {
            let newValue = 5;
            let oldValue = 2;

            let object = observable({key: oldValue});
            let undoableAction = action('updateObject')(() => { object.key = newValue });

            let undoResult = createUndo('updateObject', true)(undoableAction);
            action('updateObject-again')(() => { object.key = 100 })();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes an array splice', () => {
            let object = observable([1, 2, 3, 4, 5, 6] as any[]);
            let undoableAction = action('spliceArray')(() => { object.splice(2, 3, 'a') });

            let undoResult = createUndo('spliceArray', true)(undoableAction);
            action('spliceArray-again')(() => { object[2] = 100 })();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes an add to a map', () => {
            let index = 'key';
            let newValue = 5;

            let object = map({});
            let undoableAction = action('addMap')(() => { object.set(index, newValue) });

            let undoResult = createUndo('addMap', true)(undoableAction);
            action('addMap-again')(() => {object.set(index, 100);})();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes an add to an object', () => {
            let index = 'key';
            let newValue = 5;

            let object: any = observable({});
            let undoableAction = action('addObject')(() => { extendObservable(object, {[index]: newValue}) });

            let undoResult = createUndo('addObject', true)(undoableAction);
            action('addMap-again')(() => {object[index] = 100;})();

            expect(undoResult).toThrow();
        });

        it('throws an exception when it undoes a delete to a map', () => {
            let index = 'key';
            let oldValue = 5;

            let object = map({[index]: oldValue});
            let undoableAction = action('deleteMap')(() => { object.delete(index) });

            let undoResult = createUndo('deleteMap', true)(undoableAction);
            action('deleteMap-again')(() => {object.set(index, 100);})();

            expect(undoResult).toThrow();
        });
    });

    it('handles nested undo windows', () => {
        let array = observable([1, 2, 3, 4, 5]);

        let outerUndo = createUndo('outerUndo')(action('outerUndo')(() => {
            array[0] = 0;

            expect(array.slice(0)).toEqual([0, 2, 3, 4, 5]);

            let innerUndo = createUndo('innerUndo')(action('innerUndo')(() => {
                array[1] = 0;
            }));

            array[2] = 0;

            expect(array.slice(0)).toEqual([0, 0, 0, 4, 5]);

            innerUndo();

            expect(array.slice(0)).toEqual([0, 2, 0, 4, 5]);
        }));

        outerUndo();

        expect(array.slice(0)).toEqual([1, 2, 3, 4, 5]);
    });
});