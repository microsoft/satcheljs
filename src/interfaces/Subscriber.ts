import ActionMessage from './ActionMessage';
import MutatorFunction from './MutatorFunction';
import OrchestratorFunction from './OrchestratorFunction';

type Subscriber<T extends ActionMessage, U> = MutatorFunction<T, U> | OrchestratorFunction<T>;
export default Subscriber;
