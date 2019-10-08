import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Popper from 'popper.js';
import $ from '../../js/ui/JQuery';
import {Point} from '../../js/Point';
import {MouseDirection} from '../../js/ui/popup/Popup';
import {MouseEventReferenceObject} from '../../js/ui/popup/MouseEventReferenceObject';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    const ref = $('#button-a');

    // FIXME: needs
    //
    //     clientHeight: number;
    //     clientWidth: number;
    //
    //     getBoundingClientRect(): ClientRect;

    const target = document.querySelector("#para")!.firstChild!;

    const popup = $('#popup');
    popup.hide();

    ref.click(function() {
        popup.show();
    });

    // TODO: add TWO events.. one mouse down, and one mouse up.. then keep track
    // of the delta between mouse up and mouse down to see where we should place
    // the popper.

    let originPoint: Point | undefined;

    document.addEventListener('mousedown', (event: MouseEvent) => {

        originPoint = {
            x: event.x,
            y: event.y
        };

    });

    document.addEventListener('mouseup', (event: MouseEvent) => {

        // compute the direction...

        if (! window.getSelection()!.isCollapsed) {

            // compute if the mouse is moving down or up to figure out the best
            // place to put the mouse
            const mouseDirection: MouseDirection = event.y - originPoint!.y < 0 ? 'up' : 'down';

            const placement = mouseDirection === 'down' ? 'bottom' : 'top';

            // console.log("mouseDirection: " + mouseDirection)
            // console.log("placement: " + placement)
            //
            // console.log("selection active");

            // const referenceObject = new RangeReferenceObject();

            const range = window.getSelection()!.getRangeAt(0);
            const referenceObject = new MouseEventReferenceObject(event, range, mouseDirection);
            const popper = new Popper(referenceObject, popup , {

                placement,
                onCreate: (data) => {
                    popup.show();
                    // TODO: automatically hide the popper if they click outside of the UI.
                },
                modifiers: {
                    // flip: {
                    //     behavior: ['left', 'right', 'top', 'bottom']
                    // },
                    // offset: {
                    //     enabled: true,
                    //     offset: '10,0'
                    // }
                    // arrow: {
                    //     enabled: true
                    // }
                }

            });


        }

    });


});
