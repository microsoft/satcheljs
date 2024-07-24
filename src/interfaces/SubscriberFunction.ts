import type ActionMessage from './ActionMessage';
import type MutatorFunction from './MutatorFunction';
import type OrchestratorFunction from './OrchestratorFunction';

type SubscriberFunction<TAction extends ActionMessage, TReturn> =
    | MutatorFunction<TAction, TReturn>
    | OrchestratorFunction<TAction>;
export default SubscriberFunction;
