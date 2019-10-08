import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Toaster} from '../../js/ui/toaster/Toaster';

import {assert} from 'chai';
import {wait} from 'dom-testing-library';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    Toaster.success('hello', 'world');

    await wait(() => {
        return assert.notEqual(document.querySelector('#toast-container'), null);
    });


    await wait(() => {

        const toastTitle = document.querySelector('.toast-title');
        const toastMessage = document.querySelector('.toast-message');

        assert.notEqual(toastTitle, null);
        assert.notEqual(toastMessage, null);

        assert.equal(toastTitle!.textContent, 'world');
        assert.equal(toastMessage!.textContent, 'hello');

    });

    Toaster.info(`A new version of Polar has been release.  Please upgrade. <a href="http://cnn.com">world</a>`,
                 'world',
                 {
                     requiresAcknowledgment: true,
                     positionClass: 'toast-top-full-width'
                 });

    await state.testResultWriter.write(true);

});
