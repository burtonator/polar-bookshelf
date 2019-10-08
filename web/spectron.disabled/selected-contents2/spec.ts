import {WebDriverTestResultReader} from '../../js/test/results/reader/WebDriverTestResultReader';
import {Spectron} from '../../js/test/Spectron';
import {assertJSON} from '../../js/test/Assertions';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

const assert = require('assert');

describe('selected-contents2', function() {

    Spectron.setup(__dirname);
    this.timeout(30000);

    xit('basic test', async function() {

        assert.equal(await this.app.client.getWindowCount(), 1);

        let testResultReader = new WebDriverTestResultReader(this.app);


        let expected: any = {
                "text": "interesting text.\n\nParagraph two starts here.\n\nthis is just raw text with",
                "html": "<b>interesting</b> text.\n    \n\n    \n        Paragraph two starts <i>here</i>.\n    \n\n    \n        this is just raw text with",
                "rectTexts": [
                    {
                        "clientRects": {
                            "0": {
                                "x": 188.234375,
                                "y": 67.4375,
                                "width": 99.1875,
                                "height": 19,
                                "top": 67.4375,
                                "right": 287.421875,
                                "bottom": 86.4375,
                                "left": 188.234375
                            }
                        },
                        "boundingClientRect": {
                            "x": 188.234375,
                            "y": 67.4375,
                            "width": 99.1875,
                            "height": 19,
                            "top": 67.4375,
                            "right": 287.421875,
                            "bottom": 86.4375,
                            "left": 188.234375
                        },
                        "boundingPageRect": {
                            "left": 188.234375,
                            "top": 67.4375,
                            "right": 287.421875,
                            "bottom": 86.4375,
                            "width": 99.1875,
                            "height": 19,
                            "x": 188.234375,
                            "y": 67.4375
                        },
                        "text": "interesting"
                    },
                    {
                        "clientRects": {
                            "0": {
                                "x": 287.421875,
                                "y": 67.4375,
                                "width": 41.515625,
                                "height": 19,
                                "top": 67.4375,
                                "right": 328.9375,
                                "bottom": 86.4375,
                                "left": 287.421875
                            }
                        },
                        "boundingClientRect": {
                            "x": 287.421875,
                            "y": 67.4375,
                            "width": 41.515625,
                            "height": 19,
                            "top": 67.4375,
                            "right": 328.9375,
                            "bottom": 86.4375,
                            "left": 287.421875
                        },
                        "boundingPageRect": {
                            "left": 287.421875,
                            "top": 67.4375,
                            "right": 328.9375,
                            "bottom": 86.4375,
                            "width": 41.515625,
                            "height": 19,
                            "x": 287.421875,
                            "y": 67.4375
                        },
                        "text": " text.\n    "
                    },
                    {
                        "clientRects": {
                            "0": {
                                "x": 8,
                                "y": 102.4375,
                                "width": 176.234375,
                                "height": 19,
                                "top": 102.4375,
                                "right": 184.234375,
                                "bottom": 121.4375,
                                "left": 8
                            }
                        },
                        "boundingClientRect": {
                            "x": 8,
                            "y": 102.4375,
                            "width": 176.234375,
                            "height": 19,
                            "top": 102.4375,
                            "right": 184.234375,
                            "bottom": 121.4375,
                            "left": 8
                        },
                        "boundingPageRect": {
                            "left": 8,
                            "top": 102.4375,
                            "right": 184.234375,
                            "bottom": 121.4375,
                            "width": 176.234375,
                            "height": 19,
                            "x": 8,
                            "y": 102.4375
                        },
                        "text": "\n        Paragraph two starts "
                    },
                    {
                        "clientRects": {
                            "0": {
                                "x": 184.234375,
                                "y": 102.4375,
                                "width": 36.890625,
                                "height": 19,
                                "top": 102.4375,
                                "right": 221.125,
                                "bottom": 121.4375,
                                "left": 184.234375
                            }
                        },
                        "boundingClientRect": {
                            "x": 184.234375,
                            "y": 102.4375,
                            "width": 36.890625,
                            "height": 19,
                            "top": 102.4375,
                            "right": 221.125,
                            "bottom": 121.4375,
                            "left": 184.234375
                        },
                        "boundingPageRect": {
                            "left": 184.234375,
                            "top": 102.4375,
                            "right": 221.125,
                            "bottom": 121.4375,
                            "width": 36.890625,
                            "height": 19,
                            "x": 184.234375,
                            "y": 102.4375
                        },
                        "text": "here"
                    },
                    {
                        "clientRects": {
                            "0": {
                                "x": 221.125,
                                "y": 102.4375,
                                "width": 5.078125,
                                "height": 19,
                                "top": 102.4375,
                                "right": 226.203125,
                                "bottom": 121.4375,
                                "left": 221.125
                            }
                        },
                        "boundingClientRect": {
                            "x": 221.125,
                            "y": 102.4375,
                            "width": 5.078125,
                            "height": 19,
                            "top": 102.4375,
                            "right": 226.203125,
                            "bottom": 121.4375,
                            "left": 221.125
                        },
                        "boundingPageRect": {
                            "left": 221.125,
                            "top": 102.4375,
                            "right": 226.203125,
                            "bottom": 121.4375,
                            "width": 5.078125,
                            "height": 19,
                            "x": 221.125,
                            "y": 102.4375
                        },
                        "text": ".\n    "
                    },
                    {
                        "clientRects": {
                            "0": {
                                "x": 8,
                                "y": 137.4375,
                                "width": 196.5,
                                "height": 19,
                                "top": 137.4375,
                                "right": 204.5,
                                "bottom": 156.4375,
                                "left": 8
                            }
                        },
                        "boundingClientRect": {
                            "x": 8,
                            "y": 137.4375,
                            "width": 196.5,
                            "height": 19,
                            "top": 137.4375,
                            "right": 204.5,
                            "bottom": 156.4375,
                            "left": 8
                        },
                        "boundingPageRect": {
                            "left": 8,
                            "top": 137.4375,
                            "right": 204.5,
                            "bottom": 156.4375,
                            "width": 196.5,
                            "height": 19,
                            "x": 8,
                            "y": 137.4375
                        },
                        "text": "\n        this is just raw text with"
                    }
                ]
            }
        ;




        assertJSON(Dictionaries.sorted(await testResultReader.read()), Dictionaries.sorted(expected));


    });

});
