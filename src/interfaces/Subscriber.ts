import ActionMessage from './ActionMessage';
import { Mutator } from './Mutator';
import { Orchestrator } from './Orchestrator';

export type Subscriber<TAction extends ActionMessage, TReturn = void> =
    | Mutator<TAction, TReturn>
    | Orchestrator<TAction>;
