import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {CommentPopupBoxes} from '../../js/comments/react/CommentPopupBoxes';
import {SimpleReactor} from '../../js/reactor/SimpleReactor';
import {CommentInputEvent} from '../../js/comments/react/CommentInputEvent';

import $ from '../../js/ui/JQuery';

SpectronRenderer.run(async () => {

    console.log("Running within SpectronRenderer now.");

    const commentEventDispatcher = new SimpleReactor<CommentInputEvent>();

    CommentPopupBoxes.create(commentEventDispatcher, (commentCreatedEvent) => console.log("Got a comment: " + commentCreatedEvent.text));

    // commentEventDispatcher.dispatchEvent({
    //     point: {
    //         x: 100,
    //         y: 100
    //     },
    //     type: 'create'
    // });
    //

    // document.addEventListener('contextmenu', event => {
    //
    //     commentEventDispatcher.dispatchEvent({
    //         point: {
    //             x: event.x,
    //             y: event.y
    //         },
    //         pageNum: 1,
    //         type: 'create'
    //     });
    //
    // });

    // Popup.createAtPoint({x: 100, y: 100}, 'bottom', this.popupElement!);

});
