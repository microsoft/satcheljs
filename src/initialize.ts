declare var global: any;

export default function initialize() {
    // Multiple instances of SatchelJS won't play nicely with each other, so guard against that.
    if (global._isSatchelJsLoaded) {
        throw new Error("Another instance of SatchelJS is already loaded.");
    }

    global._isSatchelJsLoaded = true;
}
