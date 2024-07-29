import ActionCreator from './ActionCreator';

type MutatorActionTarget<F extends ActionCreator<any> = ActionCreator<any>> =
    void extends ReturnType<F> ? F : never;

export default MutatorActionTarget;
