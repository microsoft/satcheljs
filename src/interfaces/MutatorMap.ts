import Mutator from '../Mutator';
import CombinedMutator from '../CombinedMutator';

type MutatorMap<TState> = { [K in keyof TState]: Mutator<TState[K]> | CombinedMutator<TState[K]> };
export default MutatorMap;
