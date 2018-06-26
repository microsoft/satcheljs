import Mutator from '../Mutator';
import CombinedMutator from '../CombinedMutator';

type MutatorMap<TState extends { [key: string]: any }> = {
    [K in keyof TState]: Mutator<TState[K]> | CombinedMutator<TState[K]>
};

export default MutatorMap;
