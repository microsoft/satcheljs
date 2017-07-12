/* tslint:disable:no-unused-imports */
import { ObservableMap } from 'mobx';
/* tslint:enable:no-unused-imports */
import { getGlobalContext } from './globalContext';

export default getGlobalContext().rootStore;
