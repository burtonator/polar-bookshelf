/* global $ */

import 'bootstrap';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import * as ReactDOM from '@types/react-dom';
import * as React from '@types/react';
import {RichTextEditor4} from '../../js/apps/card_creator/elements/schemaform/RichTextEditor4';

SpectronRenderer.run(async () => {

    // this disables tab input so that we can go back and forth between editor
    // controls easily.
    // delete (<any> $).summernote.options.keyMap.pc.TAB;
    // delete (<any> $).summernote.options.keyMap.mac.TAB;
    //
    // $('#app').summernote({
    //     height: 300,
    //     minHeight: 150,
    //     airMode: true
    // });

    //
    ReactDOM.render(
        <RichTextEditor4 id='foo'/>,
        document.getElementById("app")
    );


});



