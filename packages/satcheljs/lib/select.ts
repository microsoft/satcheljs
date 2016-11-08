import {Reaction, IObservableValue, isObservable} from 'mobx';

export interface SelectorFunction {
    [key: string]: () => any;
}

/**
 * Decorator for action functions. Selects a subset from the state tree for the action.
 */
export default function select(selector: SelectorFunction) {
    return function decorator<T extends Function>(target: T): T {
        let _this = this;

        let returnValue: any = function() {
            let state = {};
            let reaction = new Reaction('something', null);

            Object.keys(selector).forEach(key => {
                reaction.track(selector[key]);
                let observable: IObservableValue<any> = <any>reaction.observing[reaction.observing.length - 1];

                Object.defineProperty(state, key, {
                    get: observable.get.bind(observable),
                    set: observable.set.bind(observable)
                });
            });

            [].push.call(arguments, state);
            return target.apply(_this, arguments);
        }

        return <T>returnValue;
    }
}