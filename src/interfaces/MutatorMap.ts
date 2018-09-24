import LeafMutator from '../LeafMutator';
import CombinedMutator from '../CombinedMutator';

type MutatorMap<TState extends { [key: string]: any }> = {
    [K in keyof TState]: LeafMutator<TState[K]> | CombinedMutator<TState[K]>
};

export default MutatorMap;
