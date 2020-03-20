type SimpleAction<T> = void extends T ? (...args: any[]) => T : never;
export default SimpleAction;
