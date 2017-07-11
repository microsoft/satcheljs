import { ObservableMap } from 'mobx';
import { getGlobalContext } from './globalContext';

export { ObservableMap };
export default getGlobalContext().rootStore;
