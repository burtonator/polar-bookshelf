/* global $ */

import $ from '../../js/ui/JQuery';
import 'summernote/dist/summernote-lite';
// import 'bootstrap/js/src/modal';
// import 'bootstrap/js/src/dropdown';
// import 'bootstrap/js/src/tooltip';

//
//
// // require('bootstrap/js/dist/modal.js');
// // require('bootstrap/js/dist/dropdown.js');
// // require('bootstrap/js/dist/tooltip.js');
// // require('bootstrap/dist/css/bootstrap.css');
// // require('font-awesome/css/font-awesome.css');
// // require('summernote/dist/summernote.css');
// // require('summernote/dist/summernote-bs4');
//
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    // this disables tab input so that we can go back and forth between editor
    // controls easily.
    // delete (<any> $).summernote.options.keyMap.pc.TAB;
    // delete (<any> $).summernote.options.keyMap.mac.TAB;

    $('.summernote').summernote({
        height: 300,
        minHeight: 150,
        airMode: true
    });

});


