import type { ObservableMap } from 'mobx';
import type ActionCreator from './ActionCreator';
import type ActionMessage from './ActionMessage';
import type MutatorActionTarget from './MutatorActionTarget';
import type Subscriber from './Subscriber';

type Satchel = {
    /**
     * Registers a subscriber (mutator or orchestrator) with this satchel.
     * Registering the same subscriber with the same satchel more than once is a no-op.
     * Throws if the subscriber's action creator was created by a different satchel instance.
     */
    register: <TAction extends ActionMessage, TReturn = void>(
        subscriber: Subscriber<TAction, TReturn>
    ) => void;

    /**
     * Dispatches the action message.
     * Throws if called from within a mutator or if the action message was created by a different satchel instance.
     * @param actionMessage {ActionMessage} The action message to dispatch
     * @returns {void}
     */
    dispatch: (actionMessage: ActionMessage) => void;
    /**
     * Decorates a function as an action creator.
     * @template T (type parameter) An interface describing the shape of the action message to create.
     * @param actionType {string}:A string which identifies the type of the action.
     * @param target {((...) => T)=} A function which creates and returns an action message
     * @returns {ActionCreator<T>} An action creator
     */
    actionCreator: <
        T extends ActionMessage = {},
        TActionCreator extends ActionCreator<T> = () => T,
    >(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;
    /**
     * Decorates a function as an action creator which also dispatches the action message after creating it.
     *
     * @template T (type parameter) An interface describing the shape of the action message to create.
     * @param actionType {string}:A string which identifies the type of the action.
     * @param target {((...) => T)=} A function which creates and returns an action message
     * @returns {ActionCreator<T>} An action creator
     */
    action: <T extends ActionMessage = {}, TActionCreator extends ActionCreator<T> = () => T>(
        actionType: string,
        target?: TActionCreator
    ) => TActionCreator;

    /**
     * Decorates a function as a mutator action.
     *
     * - mutatorAction encapsulates action creation, dispatch, and registering the mutator in one simple function call.
     * - Use mutatorAction as a convenience when an action only needs to trigger one specific mutator.
     * - Because the action creator is not exposed, no other mutators or orchestrators can subscribe to it. If an action needs multiple handlers then it must use the full pattern with action creators and handlers implemented separately.
     *
     * @param actionType {string}:A string which identifies the type of the action.
     * @param target {(...args: TArgs) => void} A function to register as a mutator.
     * @returns {(...args: TArgs) => void} A function that creates and dispatches the action with the given arguments.
     */
    mutatorAction: <TFunction extends ActionCreator<any>>(
        actionType: string,
        target: MutatorActionTarget<TFunction>
    ) => (...args: Parameters<TFunction>) => void;

    /**
     * Creates a Satchel store and returns a selector to it.
     *
     * @template T (type parameter) An interface describing the shape of the store.
     * @param name {string} A unique identifier for the store.
     * @param initialState {T} The initial state of the store.
     * @returns {() => T} A selector to the store.
     */
    createStore: <T>(key: string, initialState: T) => () => T;
    /**
     * Returns Satchel's root store object of the satchel instance.
     * @returns {ObservableMap<any>} The root store object
     */
    getRootStore: () => ObservableMap<any>;
    /**
     * Returns whether the action creator has any subscribers registered with this satchel.
     * @returns {boolean} True if the action creator has subscribers, false otherwise.
     */
    hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => boolean;

    /**
     * Utility function to get the action type of the mutator currently being executed, or null if no mutator is executing.
     */
    getCurrentMutator: () => string | null;
};
export default Satchel;
