import { getGlobalContext } from '../globalContext';

export function initializeTestMode() {
    getGlobalContext().legacyTestMode = true;
}

export function resetTestMode() {
    getGlobalContext().legacyTestMode = false;
}
