import { Lambda, spy } from 'mobx';
import satcheljsAction from './action';

let spyRefCount = 0;
let spyDisposer: Lambda = null;

function initializeSpy() {
    if (spyRefCount === 0) {
        spyDisposer = spy(spyOnChanges);
    }
    spyRefCount++;
}

function disposeSpy() {
    spyRefCount--;
    if (spyRefCount === 0) {
        spyDisposer();
        spyDisposer = null;
    }
}

interface UndoStep {
    verify: () => boolean;
    objectName: string;
    propertyName: string;
    undo: () => void;
}

interface UndoWindow {
    steps: UndoStep[];
}

// We may have nested "undo" actions, so we need to track those windows separately
let undoWindows: UndoWindow[] = [];

function spyOnChanges(event: any) {
    let undoStep: UndoStep;
    let modifiedObject = event.object;

    switch(event.type) {
        case 'update':
            if (event.index !== undefined) {
                // update (array)
                undoStep = {
                    verify: () => modifiedObject[event.index] === event.newValue,
                    objectName: modifiedObject.$mobx.name,
                    propertyName: event.index,
                    undo: () => { modifiedObject[event.index] = event.oldValue; }
                };
            } else if (typeof modifiedObject.get !== 'undefined') {
                // update (map)
                undoStep = {
                    verify: () => modifiedObject.get(event.name) === event.newValue,
                    objectName: modifiedObject.$mobx.name,
                    propertyName: event.name,
                    undo: () => { modifiedObject.set(event.name, event.oldValue); }
                };
            } else {
                // update (object)
                undoStep = {
                    verify: () => modifiedObject[event.name] === event.newValue,
                    objectName: modifiedObject.$mobx.name,
                    propertyName: event.name,
                    undo: () => { modifiedObject[event.name] = event.oldValue; }
                };
            }
            break;
        case 'splice':
            undoStep = {
                verify: () => {
                    for (let i = 0; i < event.addedCount; i++) {
                        if (modifiedObject[event.index + i] !== event.added[i]) {
                            return false;
                        }
                    }
                    return true;
                },
                objectName: modifiedObject.$mobx.name,
                propertyName: event.index,
                undo: () => {
                    // First, remove the added items.
                    // Then, add items back one at a time, because passing an array in to 'splice' will insert the array as a single item
                    modifiedObject.splice(event.index, event.addedCount);
                    for (let i = 0; i < event.removedCount; i++) {
                        modifiedObject.splice(event.index + i, 0, event.removed[i]);
                    }
                }
            };
            break;
        case 'add':
            if (typeof modifiedObject.get !== 'undefined') {
                // add (map)
                undoStep = {
                    verify: () => modifiedObject.get(event.name) === event.newValue,
                    objectName: modifiedObject.$mobx.name,
                    propertyName: event.name,
                    undo: () => { modifiedObject.delete(event.name); }
                }
            } else {
                // add (object)
                undoStep = {
                    verify: () => modifiedObject[event.name] === event.newValue,
                    objectName: modifiedObject.$mobx.name,
                    propertyName: event.name,
                    undo: () => { delete modifiedObject[event.name]; }
                }
            }
            break;
        case 'delete':
            undoStep = {
                verify: () => !modifiedObject.has(event.name),
                objectName: modifiedObject.$mobx.name,
                propertyName: event.name,
                undo: () => { modifiedObject.set(event.name, event.oldValue); }
            }
            break;
        default:
            // Nothing worth tracking
            return;
    }

    undoWindows.forEach(undoWindow => undoWindow.steps.push(undoStep));
}

export interface UndoResult<T> {
    actionReturnValue?: T;
    (): void;
}

export type CreateUndoReturnValue<T> = (action: () => T | void) => UndoResult<T>;

function trackUndo<T>(
    actionName: string,
    action: () => T,
    undoVerifiesChanges: boolean) : UndoResult<T> {

        initializeSpy();
        undoWindows.push({steps: []});

        try {
            let returnValue: T = action();

            let undoWindow : UndoWindow = undoWindows[undoWindows.length - 1];
            let undoPreviouslyExecuted = false;

            // Reverse the steps, as changes made later in the action may depend on changes earlier in the action
            undoWindow.steps.reverse();

            let undo: UndoResult<T> = satcheljsAction(`undo-${actionName}`)(() => {
                if (undoPreviouslyExecuted) {
                    throw `This instance of undo-${actionName} has already been executed`;
                }
                if (undoVerifiesChanges) {
                    undoWindow.steps.forEach(step => {
                        if (!step.verify()) {
                            throw `Property "${step.propertyName} on store object "${step.objectName} changed since action was performed.`
                        }
                    })
                }
                undoWindow.steps.forEach(step => step.undo());
                undoPreviouslyExecuted = true;
            });

            undo.actionReturnValue = returnValue;

            return undo;
        } finally {
            undoWindows.pop();
            disposeSpy();
        }
}

/**
 * Creates a function to undo all store changes done by a supplied action
 * @param {string} actionName is the name of the action being tracked. The returned undo action will be given the name undo-<actionName>.
 * @param {boolean} undoVerifiesChanges indicates whether the returned undo action will verify no subsequent changes have been made to
 *      objects being tracked since the original action has been performed. If true and changes have since been made to modified objects,
 *      the undo action will not make any changes and will throw an exception.
 */
export default function createUndo<T>(
    actionName: string,
    undoVerifiesChanges?: boolean) : CreateUndoReturnValue<T> {

        return (action: () => T) => {
            return trackUndo(
                    actionName,
                    action,
                    !!undoVerifiesChanges);
        };
}
