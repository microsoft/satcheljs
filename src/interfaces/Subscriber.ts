import ActionMessage from './ActionMessage';
import MutatorFunction from './MutatorFunction';
import OrchestratorFunction from './OrchestratorFunction';

type Subscriber<TAction extends ActionMessage, TReturn> =
    | MutatorFunction<TAction, TReturn>
    | OrchestratorFunction<TAction>;
export default Subscriber;
