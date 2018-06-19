import Mutator from './Mutator';

export default function createMutator<TState>(initialValue: TState) {
    return new Mutator(initialValue);
}
