import LeafMutator from './LeafMutator';

export default function createMutator<TState>(initialValue: TState) {
    return new LeafMutator(initialValue);
}
