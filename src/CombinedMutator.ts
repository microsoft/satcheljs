import ActionMessage from './interfaces/ActionMessage';
import MutatorMap from './interfaces/MutatorMap';

export default class CombinedMutator<TState extends { [key: string]: any }> {
    private mutatorKeys: string[];

    constructor(private mutatorMap: MutatorMap<TState>) {
        this.mutatorKeys = Object.keys(this.mutatorMap);
    }

    getInitialValue() {
        let initialValue: TState = <TState>{};
        this.mutatorKeys.forEach(key => {
            initialValue[key] = this.mutatorMap[key].getInitialValue();
        });

        return initialValue;
    }

    handleAction(
        currentState: TState,
        actionMessage: ActionMessage,
        replaceState: (newState: TState) => void
    ) {
        this.mutatorKeys.forEach(key => {
            this.mutatorMap[key].handleAction(currentState[key], actionMessage, newState => {
                currentState[key] = newState;
            });
        });
    }
}
