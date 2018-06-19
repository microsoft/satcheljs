import MutatorMap from './interfaces/MutatorMap';
import CombinedMutator from './CombinedMutator';

export default function combineMutators<TState>(mutatorMap: MutatorMap<TState>) {
    return new CombinedMutator(mutatorMap);
}
