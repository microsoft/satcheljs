var jsdom = require('jsdom').jsdom;

declare module NodeJS {
    interface Global {
        document: any;
        window: Window;
        navigator: any;
        [prop: string]: any;
    }
}

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        global[property] = global.document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};