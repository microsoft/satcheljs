import type { ObservableMap } from 'mobx';
import type ActionCreator from './ActionCreator';
import type ActionMessage from './ActionMessage';
import type Mutator from './Mutator';
import type MutatorFunction from './MutatorFunction';
import type Orchestrator from './Orchestrator';
import type OrchestratorFunction from './OrchestratorFunction';
import SatchelState from './SatchelState';

type Satchel = {
    /**
     * Resolves the target of the subscriber and registers it with the dispatcher.
     */
    register<TAction extends ActionMessage, TReturn = void>(
        subscriber: Mutator<TAction, TReturn>
    ): MutatorFunction<TAction, TReturn>;
    register<TAction extends ActionMessage>(
        subscriber: Orchestrator<TAction>
    ): OrchestratorFunction<TAction>;

    /**
     * Dispatches the action message
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
     * Returns whether the action creator has any subscribers.
     * @returns {boolean} True if the action creator has subscribers, false otherwise.
     */
    hasSubscribers: (actionCreator: ActionCreator<ActionMessage>) => boolean;

    /**
     * Utility function to get the current mutator being executed.
     */
    getCurrentMutator: () => SatchelState['__currentMutator'];
    /**
     * Utility function to get the current subscriptions.
     */
    getSubscriptions: () => SatchelState['__subscriptions'];
};
export default Satchel;
