type SimpleAction<TReturn> = void extends TReturn ? (...args: any[]) => TReturn : never;
export default SimpleAction;
