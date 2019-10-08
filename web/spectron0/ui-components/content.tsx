import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {App} from './App';

import html2canvas from 'html2canvas';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

});
