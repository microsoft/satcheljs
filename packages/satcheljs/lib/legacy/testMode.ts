import { getGlobalContext } from './globalContext';

export function initializeTestMode() {
    getGlobalContext().testMode = true;
}

export function resetTestMode() {
    getGlobalContext().testMode = false;
}