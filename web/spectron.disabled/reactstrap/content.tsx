import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper from 'popper.js';
import $ from '../../js/ui/JQuery';
import * as ReactDOM from '@types/react-dom';
import * as React from '@types/react';
import App from './App';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

});




