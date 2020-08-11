type SimpleAction<TFunction extends (...args: any[]) => any> = void extends ReturnType<TFunction>
    ? TFunction
    : never;
export default SimpleAction;
