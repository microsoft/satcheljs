import type ActionMessage from './ActionMessage';
import type Mutator from './Mutator';
import type Orchestrator from './Orchestrator';

type Subscriber<TAction extends ActionMessage, TReturn = void> =
    | Mutator<TAction, TReturn>
    | Orchestrator<TAction>;

export default Subscriber;
