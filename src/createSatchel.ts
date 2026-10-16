import { createActionCreatorFactory, createActionFactory } from './actionCreator';
import createSatchelState from './createSatchelState';
import { createStoreFactory } from './createStore';
import { createDispatch } from './dispatcher';
import type Satchel from './interfaces/Satchel';
import type SatchelOptions from './interfaces/SatchelOptions';
import { createMutatorActionFactory } from './mutatorAction';
import { createHasSubscribers, createRegister } from './register';
import useStrict from './useStrict';

/**
 * Creates a new, isolated satchel instance.
 * @param options {SatchelOptions} Options such as the middleware to apply to dispatched actions.
 * @returns {Satchel} The satchel instance.
 */
export function createSatchel(options: SatchelOptions = {}): Satchel {
    // Default to MobX strict mode so that only mutators can modify the store
    useStrict(true);

    const state = createSatchelState();

    const register = createRegister(state);
    const dispatch = createDispatch(state, options.middleware ?? []);
    const action = createActionFactory(state, dispatch);

    return {
        register,
        dispatch,
        actionCreator: createActionCreatorFactory(state),
        action,
        mutatorAction: createMutatorActionFactory(action, register),
        createStore: createStoreFactory(state),
        getRootStore: () => state.rootStore,
        hasSubscribers: createHasSubscribers(state),
        getCurrentMutator: () => state.currentMutator,
    };
}
