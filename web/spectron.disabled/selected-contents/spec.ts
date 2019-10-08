import assert from 'assert';
import {Spectron} from '../../js/test/Spectron';

const TIMEOUT = 10000;

xdescribe('SelectContents of HTML entities.', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    xit('Test of select contents... ', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let webContents = this.app.webContents;

        assert.ok(webContents);
        assert.ok(webContents.executeJavaScript);

        let executed = await this.app.client.execute(`return testFunction();`);

    });

});

// it('Test of select contents... ', async function () {
    //
    //     assert.equal(await this.app.client.getWindowCount(), 1);
    //
    //     let webContents = this.app.webContents;
    //
    //     assert.ok(webContents);
    //     assert.ok(webContents.executeJavaScript);
    //
    //     let executed = await this.app.client.execute(() => {
    //
    //         const {MockSelections} = require("../../js/highlights/text/selection/MockSelections");
    //         const {SelectedContents} = require("../../js/highlights/text/selection/SelectedContents");
    //         const {SimpleHighlightRenderer} = require("../../js/highlights/text/view/SimpleHighlightRenderer.js");
    //
    //         MockSelections.createSyntheticSelection({ node: document.querySelector("#n4"), offset: 0},
    //                                                 { node: document.querySelector("#n7").firstChild, offset: 35});
    //
    //         let selectedContents = SelectedContents.compute(window);
    //
    //         window.getSelection().empty();
    //
    //         SimpleHighlightRenderer.renderSelectedContents(selectedContents);
    //
    //         // we have to stringify ourselves because the webdriver re-orders
    //         // the keys on us which is annoying.
    //         return JSON.stringify(selectedContents, null, "  ");
    //
    //     });
    //
    //     let actual = JSON.parse(executed.value);
    //
    //     let expected = {
    //             "text": "interesting text.\n\nParagraph two starts here.\n\nthis is just raw text with",
    //             "html": "<b>interesting</b> text.\n    \n\n    \n        Paragraph two starts <i>here</i>.\n    \n\n    \n        this is just raw text with",
    //             "rectTexts": [
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 188.234375,
    //                             "y": 67.4375,
    //                             "width": 99.1875,
    //                             "height": 19,
    //                             "top": 67.4375,
    //                             "right": 287.421875,
    //                             "bottom": 86.4375,
    //                             "left": 188.234375
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 188.234375,
    //                         "y": 67.4375,
    //                         "width": 99.1875,
    //                         "height": 19,
    //                         "top": 67.4375,
    //                         "right": 287.421875,
    //                         "bottom": 86.4375,
    //                         "left": 188.234375
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 188.234375,
    //                         "top": 67.4375,
    //                         "right": 287.421875,
    //                         "bottom": 86.4375,
    //                         "width": 99.1875,
    //                         "height": 19,
    //                         "x": 188.234375,
    //                         "y": 67.4375
    //                     },
    //                     "text": "interesting"
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 287.421875,
    //                             "y": 67.4375,
    //                             "width": 41.515625,
    //                             "height": 19,
    //                             "top": 67.4375,
    //                             "right": 328.9375,
    //                             "bottom": 86.4375,
    //                             "left": 287.421875
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 287.421875,
    //                         "y": 67.4375,
    //                         "width": 41.515625,
    //                         "height": 19,
    //                         "top": 67.4375,
    //                         "right": 328.9375,
    //                         "bottom": 86.4375,
    //                         "left": 287.421875
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 287.421875,
    //                         "top": 67.4375,
    //                         "right": 328.9375,
    //                         "bottom": 86.4375,
    //                         "width": 41.515625,
    //                         "height": 19,
    //                         "x": 287.421875,
    //                         "y": 67.4375
    //                     },
    //                     "text": " text.\n    "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 102.4375,
    //                             "width": 176.234375,
    //                             "height": 19,
    //                             "top": 102.4375,
    //                             "right": 184.234375,
    //                             "bottom": 121.4375,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 102.4375,
    //                         "width": 176.234375,
    //                         "height": 19,
    //                         "top": 102.4375,
    //                         "right": 184.234375,
    //                         "bottom": 121.4375,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 102.4375,
    //                         "right": 184.234375,
    //                         "bottom": 121.4375,
    //                         "width": 176.234375,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 102.4375
    //                     },
    //                     "text": "\n        Paragraph two starts "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 184.234375,
    //                             "y": 102.4375,
    //                             "width": 36.890625,
    //                             "height": 19,
    //                             "top": 102.4375,
    //                             "right": 221.125,
    //                             "bottom": 121.4375,
    //                             "left": 184.234375
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 184.234375,
    //                         "y": 102.4375,
    //                         "width": 36.890625,
    //                         "height": 19,
    //                         "top": 102.4375,
    //                         "right": 221.125,
    //                         "bottom": 121.4375,
    //                         "left": 184.234375
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 184.234375,
    //                         "top": 102.4375,
    //                         "right": 221.125,
    //                         "bottom": 121.4375,
    //                         "width": 36.890625,
    //                         "height": 19,
    //                         "x": 184.234375,
    //                         "y": 102.4375
    //                     },
    //                     "text": "here"
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 221.125,
    //                             "y": 102.4375,
    //                             "width": 5.078125,
    //                             "height": 19,
    //                             "top": 102.4375,
    //                             "right": 226.203125,
    //                             "bottom": 121.4375,
    //                             "left": 221.125
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 221.125,
    //                         "y": 102.4375,
    //                         "width": 5.078125,
    //                         "height": 19,
    //                         "top": 102.4375,
    //                         "right": 226.203125,
    //                         "bottom": 121.4375,
    //                         "left": 221.125
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 221.125,
    //                         "top": 102.4375,
    //                         "right": 226.203125,
    //                         "bottom": 121.4375,
    //                         "width": 5.078125,
    //                         "height": 19,
    //                         "x": 221.125,
    //                         "y": 102.4375
    //                     },
    //                     "text": ".\n    "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 137.4375,
    //                             "width": 196.5,
    //                             "height": 19,
    //                             "top": 137.4375,
    //                             "right": 204.5,
    //                             "bottom": 156.4375,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 137.4375,
    //                         "width": 196.5,
    //                         "height": 19,
    //                         "top": 137.4375,
    //                         "right": 204.5,
    //                         "bottom": 156.4375,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 137.4375,
    //                         "right": 204.5,
    //                         "bottom": 156.4375,
    //                         "width": 196.5,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 137.4375
    //                     },
    //                     "text": "\n        this is just raw text with"
    //                 }
    //             ]
    //         }
    //     ;
    //
    //     assertJSON(actual, expected);
    //
    // });

    // it('Test of select into the next h1.... ', async function () {
    //
    //     assert.equal(await this.app.client.getWindowCount(), 1);
    //
    //     /**
    //      * @type {Electron.WebContents}
    //      */
    //     let webContents = this.app.webContents;
    //
    //     assert.ok(webContents);
    //     assert.ok(webContents.executeJavaScript);
    //
    //
    //     let executed = await this.app.client.execute(() => {
    //
    //         const {MockSelections} = require("../../js/highlights/text/selection/MockSelections");
    //         const {SelectedContents} = require("../../js/highlights/text/selection/SelectedContents");
    //         const {SimpleHighlightRenderer} = require("../../js/highlights/text/view/SimpleHighlightRenderer.js");
    //
    //         MockSelections.createSyntheticSelection({ node: document.querySelector("#n7").firstChild, offset: 0},
    //                                                 { node: document.querySelector("#n8"), offset: 0});
    //
    //         let selectedContents = SelectedContents.compute(window);
    //         SimpleHighlightRenderer.renderSelectedContents(selectedContents);
    //
    //         // we have to stringify ourselves because the webdriver re-orders
    //         // the keys on us which is annoying.
    //         return JSON.stringify(selectedContents, null, "  ");
    //
    //
    //     });
    //
    //     let expected = {
    //             "text": "this is just raw text without any inner elements. this is just raw text without any inner elements. this is just raw text without any inner elements. this is just raw text without any inner elements.\n\n",
    //             "html": "\n        this is just raw text without any inner elements.\n        this is just raw text without any inner elements.\n        this is just raw text without any inner elements.\n        this is just raw text without any inner elements.\n    \n\n    ",
    //             "rectTexts": [
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 137.4375,
    //                             "width": 393.671875,
    //                             "height": 19,
    //                             "top": 137.4375,
    //                             "right": 401.671875,
    //                             "bottom": 156.4375,
    //                             "left": 8
    //                         },
    //                         "1": {
    //                             "x": 401.671875,
    //                             "y": 137.4375,
    //                             "width": 388.578125,
    //                             "height": 19,
    //                             "top": 137.4375,
    //                             "right": 790.25,
    //                             "bottom": 156.4375,
    //                             "left": 401.671875
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 137.4375,
    //                         "width": 782.25,
    //                         "height": 19,
    //                         "top": 137.4375,
    //                         "right": 790.25,
    //                         "bottom": 156.4375,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 137.4375,
    //                         "right": 790.25,
    //                         "bottom": 156.4375,
    //                         "width": 782.25,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 137.4375
    //                     },
    //                     "text": "\n        this is just raw text without any inner elements.\n        this is just raw text without any inner elements.\n        "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 156.4375,
    //                             "width": 393.671875,
    //                             "height": 19,
    //                             "top": 156.4375,
    //                             "right": 401.671875,
    //                             "bottom": 175.4375,
    //                             "left": 8
    //                         },
    //                         "1": {
    //                             "x": 401.671875,
    //                             "y": 156.4375,
    //                             "width": 388.578125,
    //                             "height": 19,
    //                             "top": 156.4375,
    //                             "right": 790.25,
    //                             "bottom": 175.4375,
    //                             "left": 401.671875
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 156.4375,
    //                         "width": 782.25,
    //                         "height": 19,
    //                         "top": 156.4375,
    //                         "right": 790.25,
    //                         "bottom": 175.4375,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 156.4375,
    //                         "right": 790.25,
    //                         "bottom": 175.4375,
    //                         "width": 782.25,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 156.4375
    //                     },
    //                     "text": "this is just raw text without any inner elements.\n        this is just raw text without any inner elements.\n    "
    //                 }
    //             ]
    //         }
    //     ;
    //
    //     assertJSON(executed.value, expected);
    //
    // });

    // it('Test of select with start and end offsets in a text node', async function () {
    //
    //     assert.equal(await this.app.client.getWindowCount(), 1);
    //
    //     /**
    //      * @type {Electron.WebContents}
    //      */
    //     let webContents = this.app.webContents;
    //
    //     assert.ok(webContents);
    //     assert.ok(webContents.executeJavaScript);
    //
    //
    //     let executed = await this.app.client.execute(() => {
    //
    //         const {MockSelections} = require("../../js/highlights/text/selection/MockSelections");
    //         const {SelectedContents} = require("../../js/highlights/text/selection/SelectedContents");
    //         const {SimpleHighlightRenderer} = require("../../js/highlights/text/view/SimpleHighlightRenderer.js");
    //
    //         MockSelections.createSyntheticSelection({ node: document.querySelector("#n7").firstChild, offset: 20},
    //                                                 { node: document.querySelector("#n7").firstChild, offset: 45});
    //
    //         let selectedContents = SelectedContents.compute(window);
    //         SimpleHighlightRenderer.renderSelectedContents(selectedContents);
    //
    //         // we have to stringify ourselves because the webdriver re-orders
    //         // the keys on us which is annoying.
    //         return JSON.stringify(selectedContents, null, "  ");
    //
    //     });
    //
    //     let expected = {
    //         "text": "t raw text without any in",
    //         "html": "t raw text without any in",
    //         "rectTexts": [
    //             {
    //                 "clientRects": {
    //                     "0": {
    //                         "x": 85.03125,
    //                         "y": 137.4375,
    //                         "width": 200.3125,
    //                         "height": 19,
    //                         "top": 137.4375,
    //                         "right": 285.34375,
    //                         "bottom": 156.4375,
    //                         "left": 85.03125
    //                     }
    //                 },
    //                 "boundingClientRect": {
    //                     "x": 85.03125,
    //                     "y": 137.4375,
    //                     "width": 200.3125,
    //                     "height": 19,
    //                     "top": 137.4375,
    //                     "right": 285.34375,
    //                     "bottom": 156.4375,
    //                     "left": 85.03125
    //                 },
    //                 "boundingPageRect": {
    //                     "left": 85.03125,
    //                     "top": 137.4375,
    //                     "right": 285.34375,
    //                     "bottom": 156.4375,
    //                     "width": 200.3125,
    //                     "height": 19,
    //                     "x": 85.03125,
    //                     "y": 137.4375
    //                 },
    //                 "text": "t raw text without any in"
    //             }
    //         ]
    //     };
    //
    //     assertJSON(executed.value, expected);
    //
    // });

    // it('Entire para', async function () {
    //
    //     assert.equal(await this.app.client.getWindowCount(), 1);
    //
    //     let executed = await this.app.client.execute(() => {
    //
    //         const {MockSelections} = require("../../js/highlights/text/selection/MockSelections");
    //         const {SelectedContents} = require("../../js/highlights/text/selection/SelectedContents");
    //         const {SimpleHighlightRenderer} = require("../../js/highlights/text/view/SimpleHighlightRenderer.js");
    //
    //         MockSelections.createSyntheticSelection({ node: document.querySelector("#n9").firstChild, offset: 13},
    //                                                 { node: document.querySelector("#n9").firstChild, offset: 243});
    //
    //         let selectedContents = SelectedContents.compute(window);
    //         SimpleHighlightRenderer.renderSelectedContents(selectedContents);
    //
    //         window.getSelection().empty();
    //
    //         // we have to stringify ourselves because the webdriver re-orders
    //         // the keys on us which is annoying.
    //         return JSON.stringify(selectedContents, null, "  ");
    //
    //     });
    //
    //     let expected = {
    //             "text": "Vestibulum pulvinar bibendum turpis at sodales. Vestibulum consectetur nulla elementum eros rhoncus, non interdum diam tristique. Praesent interdum quam in lacus finibus semper. Phasellus id feugiat tortor.",
    //             "html": "Vestibulum pulvinar bibendum turpis at sodales. Vestibulum consectetur nulla\n            elementum eros rhoncus, non interdum diam tristique. Praesent interdum quam\n            in lacus finibus semper. Phasellus id feugiat tortor.",
    //             "rectTexts": [
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 256.3125,
    //                             "width": 323.125,
    //                             "height": 19,
    //                             "top": 256.3125,
    //                             "right": 331.125,
    //                             "bottom": 275.3125,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 256.3125,
    //                         "width": 323.125,
    //                         "height": 19,
    //                         "top": 256.3125,
    //                         "right": 331.125,
    //                         "bottom": 275.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 256.3125,
    //                         "right": 331.125,
    //                         "bottom": 275.3125,
    //                         "width": 323.125,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 256.3125
    //                     },
    //                     "text": "Vestibulum pulvinar bibendum turpis at "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 275.3125,
    //                             "width": 307.421875,
    //                             "height": 19,
    //                             "top": 275.3125,
    //                             "right": 315.421875,
    //                             "bottom": 294.3125,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 275.3125,
    //                         "width": 307.421875,
    //                         "height": 19,
    //                         "top": 275.3125,
    //                         "right": 315.421875,
    //                         "bottom": 294.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 275.3125,
    //                         "right": 315.421875,
    //                         "bottom": 294.3125,
    //                         "width": 307.421875,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 275.3125
    //                     },
    //                     "text": "sodales. Vestibulum consectetur nulla\n            "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 294.3125,
    //                             "width": 321.59375,
    //                             "height": 19,
    //                             "top": 294.3125,
    //                             "right": 329.59375,
    //                             "bottom": 313.3125,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 294.3125,
    //                         "width": 321.59375,
    //                         "height": 19,
    //                         "top": 294.3125,
    //                         "right": 329.59375,
    //                         "bottom": 313.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 294.3125,
    //                         "right": 329.59375,
    //                         "bottom": 313.3125,
    //                         "width": 321.59375,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 294.3125
    //                     },
    //                     "text": "elementum eros rhoncus, non interdum "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 313.3125,
    //                             "width": 331.328125,
    //                             "height": 19,
    //                             "top": 313.3125,
    //                             "right": 339.328125,
    //                             "bottom": 332.3125,
    //                             "left": 8
    //                         },
    //                         "1": {
    //                             "x": 339.328125,
    //                             "y": 313.3125,
    //                             "width": 15.421875,
    //                             "height": 19,
    //                             "top": 313.3125,
    //                             "right": 354.75,
    //                             "bottom": 332.3125,
    //                             "left": 339.328125
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 313.3125,
    //                         "width": 346.75,
    //                         "height": 19,
    //                         "top": 313.3125,
    //                         "right": 354.75,
    //                         "bottom": 332.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 313.3125,
    //                         "right": 354.75,
    //                         "bottom": 332.3125,
    //                         "width": 346.75,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 313.3125
    //                     },
    //                     "text": "diam tristique. Praesent interdum quam\n            in "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 332.3125,
    //                             "width": 335.375,
    //                             "height": 19,
    //                             "top": 332.3125,
    //                             "right": 343.375,
    //                             "bottom": 351.3125,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 332.3125,
    //                         "width": 335.375,
    //                         "height": 19,
    //                         "top": 332.3125,
    //                         "right": 343.375,
    //                         "bottom": 351.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 332.3125,
    //                         "right": 343.375,
    //                         "bottom": 351.3125,
    //                         "width": 335.375,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 332.3125
    //                     },
    //                     "text": "lacus finibus semper. Phasellus id feugiat "
    //                 },
    //                 {
    //                     "clientRects": {
    //                         "0": {
    //                             "x": 8,
    //                             "y": 351.3125,
    //                             "width": 50.75,
    //                             "height": 19,
    //                             "top": 351.3125,
    //                             "right": 58.75,
    //                             "bottom": 370.3125,
    //                             "left": 8
    //                         }
    //                     },
    //                     "boundingClientRect": {
    //                         "x": 8,
    //                         "y": 351.3125,
    //                         "width": 50.75,
    //                         "height": 19,
    //                         "top": 351.3125,
    //                         "right": 58.75,
    //                         "bottom": 370.3125,
    //                         "left": 8
    //                     },
    //                     "boundingPageRect": {
    //                         "left": 8,
    //                         "top": 351.3125,
    //                         "right": 58.75,
    //                         "bottom": 370.3125,
    //                         "width": 50.75,
    //                         "height": 19,
    //                         "x": 8,
    //                         "y": 351.3125
    //                     },
    //                     "text": "tortor."
    //                 }
    //             ]
    //         }
    //     ;
    //
    //     assertJSON(executed.value, expected);
    //
    // });

