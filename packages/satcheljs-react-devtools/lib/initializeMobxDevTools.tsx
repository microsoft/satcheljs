import * as React from 'react';
import * as ReactDom from 'react-dom';
import MobxDevTools from 'mobx-react-devtools';

export default function initializeMobxDevTools() {
    let targetDiv = document.createElement("div");
    document.body.appendChild(targetDiv);
    ReactDom.render(<MobxDevTools />, targetDiv);
}
