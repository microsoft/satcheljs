import type { IAction } from 'mobx';
import type ActionCreator from './ActionCreator';
import type ActionMessage from './ActionMessage';
import type DispatchFunction from './DispatchFunction';
import type Mutator from './Mutator';

type SatchelInternalFunctions = {
    __createActionId: () => string;
    __dispatchWithMiddleware: DispatchFunction;
    __finalDispatch: DispatchFunction;
    __createStoreAction: (key: string, initialState: any) => void;
    __createActionCreator: <T extends ActionMessage, TActionCreator extends ActionCreator<T>>(
        actionType: string,
        target: TActionCreator,
        shouldDispatch: boolean
    ) => TActionCreator;
    __wrapMutatorTarget: <TAction extends ActionMessage, TReturn>(
        mutator: Mutator<TAction, TReturn>
    ) => ((actionMessage: TAction) => void) & IAction;
};
export default SatchelInternalFunctions;
