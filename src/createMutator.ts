export class Mutator<T> {
    constructor(private initialValue: T) {}

    getInitialValue() {
        return this.initialValue;
    }
}

export function createMutator<T>(initialValue: T): Mutator<T> {
    return new Mutator(initialValue);
}
