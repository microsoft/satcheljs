/* tslint:disable:no-unused-imports */
import { ObservableMap } from 'mobx';
/* tslint:enable:no-unused-imports */
import { getGlobalContext } from './globalContext';

/**
 * Satchel-provided root store getter
 */
export default function getRootStore() {
    return getGlobalContext().rootStore;
}
