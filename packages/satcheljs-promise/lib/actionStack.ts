let actionStack: string[] = [];

export function getCurrentAction() {
    return actionStack.length ? actionStack[actionStack.length - 1] : null;
}

export default actionStack;