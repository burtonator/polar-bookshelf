import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from 'react-dom';
import * as React from '@types/react';
import App from './App';

SpectronRenderer.run(async () => {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

});





