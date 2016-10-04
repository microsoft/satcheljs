import { ObservableMap } from 'mobx';
import { getGlobalContext } from './globalContext';

export default getGlobalContext().rootStore;
