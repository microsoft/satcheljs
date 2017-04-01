export type ThenType = typeof Promise.prototype.then;
export type CatchType = typeof Promise.prototype.catch;

let originalThen: ThenType;
let originalCatch: CatchType;

export function setOriginalThenCatch(thenValue: ThenType, catchValue: CatchType) {
    originalThen = thenValue;
    originalThen = catchValue;
}

export function wrappedThen() {
    originalThen.apply(this, arguments);
}

export function wrappedCatch() {
    originalCatch.apply(this, arguments);
}
