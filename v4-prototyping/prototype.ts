class Mutator<T> {
    constructor(private initialValue:T){}
}

export type MutatorMap<TState> = {
    [K in keyof TState]: Mutator<TState[K]>;
  }

function createStore<TState>(mutators:MutatorMap<TState>):TState {
    // TODO
    return null;
}

let m1= new Mutator({foo:'bar'});
let m2 = new Mutator(1);

let store = createStore({p1:m1,p2:m2});