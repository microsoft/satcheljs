var jsdom = require('jsdom').jsdom;

/* tslint:disable:no-namespace */
declare namespace NodeJS {
    interface Global {
        document: any;
        window: Window;
        navigator: any;
        [prop: string]: any;
    }
}
/* tslint:enable:no-namespace */

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
    if (typeof global[property] === 'undefined') {
        global[property] = global.document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js',
};
