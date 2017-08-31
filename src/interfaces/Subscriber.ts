import ActionMessage from './ActionMessage';
import MutatorFunction from './MutatorFunction';
import OrchestratorFunction from './OrchestratorFunction';

type Subscriber<T extends ActionMessage> = MutatorFunction<T> | OrchestratorFunction<T>;
export default Subscriber;
