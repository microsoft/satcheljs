import ActionMessage from './ActionMessage';
import MutatorFunction from './MutatorFunction';
import OrchestratorFunction from './OrchestratorFunction';

type SubscriberFunction<TAction extends ActionMessage, TReturn> =
    | MutatorFunction<TAction, TReturn>
    | OrchestratorFunction<TAction>;
export default SubscriberFunction;
