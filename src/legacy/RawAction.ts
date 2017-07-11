interface RawAction {
    (... args: any[]): Promise<any> | void;
}

export default RawAction;
