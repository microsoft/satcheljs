import { getGlobalContext } from './globalContext';

export function useStrict(value: boolean) {
    getGlobalContext().strictMode = value;
}