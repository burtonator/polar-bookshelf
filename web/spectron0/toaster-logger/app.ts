import {SpectronRenderer} from '../../js/test/SpectronRenderer';

import {assert} from 'chai';
import {wait} from 'dom-testing-library';
import {ToasterLogger} from '../../js/logger/ToasterLogger';

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");

    const toasterLogger = new ToasterLogger();
    toasterLogger.error("Something bad", new Error("it broke"));

    await wait(() => {
        return assert.notEqual(document.querySelector('#toast-container'), null);
    });

    console.log("Got the container");

    await wait(() => {

        const toastMessage = document.querySelector('.toast-message');

        assert.notEqual(toastMessage, null);

        assert.equal(toastMessage!.textContent, 'An internal error has occurred.');

    });

    await state.testResultWriter.write(true);

});
