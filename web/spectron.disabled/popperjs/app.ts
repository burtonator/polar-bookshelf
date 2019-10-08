import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper from 'popper.js';
import $ from '../../js/ui/JQuery';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    const ref = $('#button-a');
    const popup = $('#popup');
    popup.hide();

    ref.click(function() {
        popup.show();
        const popper = new Popper(ref, popup , {
            placement: 'top',
            onCreate: (data) => {
                console.log(data);
            },
            modifiers: {
                flip: {
                    behavior: ['left', 'right', 'top', 'bottom']
                },
                offset: {
                    enabled: true,
                    offset: '0,10'
                }
            }
        });
    });

});

