import {assert} from 'chai';
import {Spectron} from '../../js/test/Spectron';
import {assertJSON} from '../../js/test/Assertions';

const TIMEOUT = 10000

describe('Text Node Splitting', function () {

    this.timeout(TIMEOUT);

    Spectron.setup(__dirname);

    xit('splitNode', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let splitNodes = await this.app.client.execute(() => {

            const {TextNodeRows} = require("../../js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            return TextNodeRows.splitElement(p);

        });

        assert.equal(splitNodes.value, 1435);

    });

    xit('computeTextRegions', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let textRegions = await this.app.client.execute(() => {

            const {TextNodeRows, NodeArray} = require("../../js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            TextNodeRows.splitElement(p);
            let nodeArray = NodeArray.createFromElement(p);

            if(nodeArray.constructor !== NodeArray) {
                throw new Error("Got back the wrong object!");
            }

            let textRegions = TextNodeRows.computeTextRegions(nodeArray);

            return textRegions.map((current: any) => current.toJSON());

        });

        let expected = [
            {
                "nrNodes": 284,
                "text": "\n    1.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    2.Sed pretium, dolor sed euismod tempor, diam urna\n    3.scelerisque tortor, vel semper ligula urna vel enim. Aenean\n    4.nec facilisis libero. Sed efficitur ac ligula in varius.\n    5.Pellentesque iaculis, enim ac "
            },
            {
                "nrNodes": 12,
                "text": "6. dignissim"
            },
            {
                "nrNodes": 90,
                "text": " aliquet, turpis\n    7.purus mattis felis, eget consequat eros velit et erat. 8.Curabitur "
            },
            {
                "nrNodes": 10,
                "text": "9. feugiat"
            },
            {
                "nrNodes": 184,
                "text": " 10.suscipit leo, vel\n\n\n    ultrices tortor sodales ut. Maecenas a magna eget nunc commodo rutrum ac et\n    augue. Quisque augue sem, ultricies ac ornare non, porta a eros. Morbi\n\n    "
            },
            {
                "nrNodes": 5,
                "text": "hello"
            },
            {
                "nrNodes": 850,
                "text": "\n\n    posuere, tellus nec cursus rhoncus, nibh leo ultricies urna, eget mollis mi\n    nisl nec purus. Mauris malesuada justo vitae finibus elementum. Donec\n    vestibulum erat ac sem consectetur eleifend. Nullam at nibh sed neque\n    accumsan tincidunt nec a enim. Aliquam pharetra orci tortor, eget gravida\n    felis dictum ac. Maecenas convallis nunc ultrices massa bibendum, et\n    dignissim elit tempus. Ut in luctus dolor, et maximus nisi. Etiam non\n    euismod sem.\n\n    Vestibulum pulvinar bibendum turpis at sodales. Vestibulum consectetur nulla\n    elementum eros rhoncus, non interdum diam tristique. Praesent interdum quam\n    in lacus finibus semper. Phasellus id feugiat tortor. Integer sed molestie\n    urna, a sodales libero. Morbi egestas egestas tortor sed sagittis. Aenean et\n    tellus non quam pellentesque ultrices vel non odio.\n"
            }
        ];

        assertJSON(textRegions.value, expected);

    });

    xit('computeTextBlocks', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let textBlocks = await this.app.client.execute(() => {

            const {TextNodeRows, NodeArray} = require("../../js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            TextNodeRows.splitElement(p);

            let nodeArray = NodeArray.createFromElement(p);
            let textRegions = TextNodeRows.computeTextRegions(nodeArray);
            let textBlocks = TextNodeRows.computeTextBlocks(textRegions);

            return textBlocks.map((current: any) => current.toJSON());

        });

        let expected = [
            {
                "nrNodes": 68,
                "text": "\n    1.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    "
            },
            {
                "nrNodes": 55,
                "text": "2.Sed pretium, dolor sed euismod tempor, diam urna\n    "
            },
            {
                "nrNodes": 66,
                "text": "3.scelerisque tortor, vel semper ligula urna vel enim. Aenean\n    "
            },
            {
                "nrNodes": 63,
                "text": "4.nec facilisis libero. Sed efficitur ac ligula in varius.\n    "
            },
            {
                "nrNodes": 32,
                "text": "5.Pellentesque iaculis, enim ac "
            },
            {
                "nrNodes": 12,
                "text": "6. dignissim"
            },
            {
                "nrNodes": 21,
                "text": " aliquet, turpis\n    "
            },
            {
                "nrNodes": 57,
                "text": "7.purus mattis felis, eget consequat eros velit et erat. "
            },
            {
                "nrNodes": 12,
                "text": "8.Curabitur "
            },
            {
                "nrNodes": 10,
                "text": "9. feugiat"
            },
            {
                "nrNodes": 44,
                "text": " 10.suscipit leo, vel\n\n\n    ultrices tortor "
            },
            {
                "nrNodes": 54,
                "text": "sodales ut. Maecenas a magna eget nunc commodo rutrum "
            },
            {
                "nrNodes": 61,
                "text": "ac et\n    augue. Quisque augue sem, ultricies ac ornare non, "
            },
            {
                "nrNodes": 25,
                "text": "porta a eros. Morbi\n\n    "
            },
            {
                "nrNodes": 5,
                "text": "hello"
            },
            {
                "nrNodes": 33,
                "text": "\n\n    posuere, tellus nec cursus "
            },
            {
                "nrNodes": 62,
                "text": "rhoncus, nibh leo ultricies urna, eget mollis mi\n    nisl nec "
            },
            {
                "nrNodes": 55,
                "text": "purus. Mauris malesuada justo vitae finibus elementum. "
            },
            {
                "nrNodes": 62,
                "text": "Donec\n    vestibulum erat ac sem consectetur eleifend. Nullam "
            },
            {
                "nrNodes": 61,
                "text": "at nibh sed neque\n    accumsan tincidunt nec a enim. Aliquam "
            },
            {
                "nrNodes": 65,
                "text": "pharetra orci tortor, eget gravida\n    felis dictum ac. Maecenas "
            },
            {
                "nrNodes": 62,
                "text": "convallis nunc ultrices massa bibendum, et\n    dignissim elit "
            },
            {
                "nrNodes": 59,
                "text": "tempus. Ut in luctus dolor, et maximus nisi. Etiam non\n    "
            },
            {
                "nrNodes": 57,
                "text": "euismod sem.\n\n    Vestibulum pulvinar bibendum turpis at "
            },
            {
                "nrNodes": 57,
                "text": "sodales. Vestibulum consectetur nulla\n    elementum eros "
            },
            {
                "nrNodes": 56,
                "text": "rhoncus, non interdum diam tristique. Praesent interdum "
            },
            {
                "nrNodes": 63,
                "text": "quam\n    in lacus finibus semper. Phasellus id feugiat tortor. "
            },
            {
                "nrNodes": 63,
                "text": "Integer sed molestie\n    urna, a sodales libero. Morbi egestas "
            },
            {
                "nrNodes": 59,
                "text": "egestas tortor sed sagittis. Aenean et\n    tellus non quam "
            },
            {
                "nrNodes": 36,
                "text": "pellentesque ultrices vel non odio.\n"
            }
        ];

        assertJSON(textBlocks.value, expected);

    });

    xit('mergeTextBlocks', async function () {

        assert.equal(await this.app.client.getWindowCount(), 1);

        // first check that we can split the basic nodes properly.
        let textBlocks = await this.app.client.execute(() => {

            const {TextNodeRows, NodeArray} = require("../../js/highlights/text/selection/TextNodeRows");

            let p = document.querySelector("p");

            TextNodeRows.splitElement(p);
            let nodeArray = NodeArray.createFromElement(p);
            let textRegions = TextNodeRows.computeTextRegions(nodeArray);
            let textBlocks = TextNodeRows.computeTextBlocks(textRegions);
            let mergedTextBlocks = TextNodeRows.mergeTextBlocks(textBlocks);
            return mergedTextBlocks.map((current: any) => current.toExternal());

        });

        let expected = [
                {
                    "rect": {
                        "bottom": 100,
                        "height": 19,
                        "left": 8,
                        "right": 478.3125,
                        "toJSON": {},
                        "top": 81,
                        "width": 470.3125,
                        "x": 8,
                        "y": 81
                    },
                    "text": "\n    1.Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    "
                },
                {
                    "rect": {
                        "bottom": 119,
                        "height": 19,
                        "left": 8,
                        "right": 437.140625,
                        "toJSON": {},
                        "top": 100,
                        "width": 429.140625,
                        "x": 8,
                        "y": 100
                    },
                    "text": "2.Sed pretium, dolor sed euismod tempor, diam urna\n    "
                },
                {
                    "rect": {
                        "bottom": 138,
                        "height": 19,
                        "left": 8,
                        "right": 503.40625,
                        "toJSON": {},
                        "top": 119,
                        "width": 495.40625,
                        "x": 8,
                        "y": 119
                    },
                    "text": "3.scelerisque tortor, vel semper ligula urna vel enim. Aenean\n    "
                },
                {
                    "rect": {
                        "bottom": 157,
                        "height": 19,
                        "left": 8,
                        "right": 435.421875,
                        "toJSON": {},
                        "top": 138,
                        "width": 427.421875,
                        "x": 8,
                        "y": 138
                    },
                    "text": "4.nec facilisis libero. Sed efficitur ac ligula in varius.\n    "
                },
                {
                    "rect": {
                        "bottom": 176,
                        "height": 19,
                        "left": 8,
                        "right": 263.265625,
                        "toJSON": {},
                        "top": 157,
                        "width": 255.265625,
                        "x": 8,
                        "y": 157
                    },
                    "text": "5.Pellentesque iaculis, enim ac "
                },
                {
                    "rect": {
                        "bottom": 176,
                        "height": 19,
                        "left": 263.265625,
                        "right": 361.34375,
                        "toJSON": {},
                        "top": 157,
                        "width": 98.078125,
                        "x": 263.265625,
                        "y": 157
                    },
                    "text": "6. dignissim"
                },
                {
                    "rect": {
                        "bottom": 176,
                        "height": 19,
                        "left": 361.34375,
                        "right": 480.765625,
                        "toJSON": {},
                        "top": 157,
                        "width": 119.421875,
                        "x": 361.34375,
                        "y": 157
                    },
                    "text": " aliquet, turpis\n    "
                },
                {
                    "rect": {
                        "bottom": 195,
                        "height": 19,
                        "left": 8,
                        "right": 443.390625,
                        "toJSON": {},
                        "top": 176,
                        "width": 435.390625,
                        "x": 8,
                        "y": 176
                    },
                    "text": "7.purus mattis felis, eget consequat eros velit et erat. "
                },
                {
                    "rect": {
                        "bottom": 214,
                        "height": 19,
                        "left": 8,
                        "right": 107.828125,
                        "toJSON": {},
                        "top": 195,
                        "width": 99.828125,
                        "x": 8,
                        "y": 195
                    },
                    "text": "8.Curabitur "
                },
                {
                    "rect": {
                        "bottom": 214,
                        "height": 19,
                        "left": 107.828125,
                        "right": 193.8125,
                        "toJSON": {},
                        "top": 195,
                        "width": 85.984375,
                        "x": 107.828125,
                        "y": 195
                    },
                    "text": "9. feugiat"
                },
                {
                    "rect": {
                        "bottom": 214,
                        "height": 19,
                        "left": 193.8125,
                        "right": 468.890625,
                        "toJSON": {},
                        "top": 195,
                        "width": 275.078125,
                        "x": 193.8125,
                        "y": 195
                    },
                    "text": " 10.suscipit leo, vel\n\n\n    ultrices tortor "
                },
                {
                    "rect": {
                        "bottom": 233,
                        "height": 19,
                        "left": 8,
                        "right": 488.578125,
                        "toJSON": {},
                        "top": 214,
                        "width": 480.578125,
                        "x": 8,
                        "y": 214
                    },
                    "text": "sodales ut. Maecenas a magna eget nunc commodo rutrum "
                },
                {
                    "rect": {
                        "bottom": 252,
                        "height": 19,
                        "left": 8,
                        "right": 472.109375,
                        "toJSON": {},
                        "top": 233,
                        "width": 464.109375,
                        "x": 8,
                        "y": 233
                    },
                    "text": "ac et\n    augue. Quisque augue sem, ultricies ac ornare non, "
                },
                {
                    "rect": {
                        "bottom": 271,
                        "height": 19,
                        "left": 8,
                        "right": 170.4375,
                        "toJSON": {},
                        "top": 252,
                        "width": 162.4375,
                        "x": 8,
                        "y": 252
                    },
                    "text": "porta a eros. Morbi\n\n    "
                },
                {
                    "rect": {
                        "bottom": 271,
                        "height": 19,
                        "left": 170.4375,
                        "right": 215.078125,
                        "toJSON": {},
                        "top": 252,
                        "width": 44.640625,
                        "x": 170.4375,
                        "y": 252
                    },
                    "text": "hello"
                },
                {
                    "rect": {
                        "bottom": 271,
                        "height": 19,
                        "left": 215.078125,
                        "right": 432.5,
                        "toJSON": {},
                        "top": 252,
                        "width": 217.421875,
                        "x": 215.078125,
                        "y": 252
                    },
                    "text": "\n\n    posuere, tellus nec cursus "
                },
                {
                    "rect": {
                        "bottom": 290,
                        "height": 19,
                        "left": 8,
                        "right": 455.40625,
                        "toJSON": {},
                        "top": 271,
                        "width": 447.40625,
                        "x": 8,
                        "y": 271
                    },
                    "text": "rhoncus, nibh leo ultricies urna, eget mollis mi\n    nisl nec "
                },
                {
                    "rect": {
                        "bottom": 309,
                        "height": 19,
                        "left": 8,
                        "right": 464.625,
                        "toJSON": {},
                        "top": 290,
                        "width": 456.625,
                        "x": 8,
                        "y": 290
                    },
                    "text": "purus. Mauris malesuada justo vitae finibus elementum. "
                },
                {
                    "rect": {
                        "bottom": 328,
                        "height": 19,
                        "left": 8,
                        "right": 493.90625,
                        "toJSON": {},
                        "top": 309,
                        "width": 485.90625,
                        "x": 8,
                        "y": 309
                    },
                    "text": "Donec\n    vestibulum erat ac sem consectetur eleifend. Nullam "
                },
                {
                    "rect": {
                        "bottom": 347,
                        "height": 19,
                        "left": 8,
                        "right": 488.078125,
                        "toJSON": {},
                        "top": 328,
                        "width": 480.078125,
                        "x": 8,
                        "y": 328
                    },
                    "text": "at nibh sed neque\n    accumsan tincidunt nec a enim. Aliquam "
                },
                {
                    "rect": {
                        "bottom": 366,
                        "height": 19,
                        "left": 8,
                        "right": 494.109375,
                        "toJSON": {},
                        "top": 347,
                        "width": 486.109375,
                        "x": 8,
                        "y": 347
                    },
                    "text": "pharetra orci tortor, eget gravida\n    felis dictum ac. Maecenas "
                },
                {
                    "rect": {
                        "bottom": 385,
                        "height": 19,
                        "left": 8,
                        "right": 472.390625,
                        "toJSON": {},
                        "top": 366,
                        "width": 464.390625,
                        "x": 8,
                        "y": 366
                    },
                    "text": "convallis nunc ultrices massa bibendum, et\n    dignissim elit "
                },
                {
                    "rect": {
                        "bottom": 404,
                        "height": 19,
                        "left": 8,
                        "right": 449.40625,
                        "toJSON": {},
                        "top": 385,
                        "width": 441.40625,
                        "x": 8,
                        "y": 385
                    },
                    "text": "tempus. Ut in luctus dolor, et maximus nisi. Etiam non\n    "
                },
                {
                    "rect": {
                        "bottom": 423,
                        "height": 19,
                        "left": 8,
                        "right": 447.375,
                        "toJSON": {},
                        "top": 404,
                        "width": 439.375,
                        "x": 8,
                        "y": 404
                    },
                    "text": "euismod sem.\n\n    Vestibulum pulvinar bibendum turpis at "
                },
                {
                    "rect": {
                        "bottom": 442,
                        "height": 19,
                        "left": 8,
                        "right": 451.453125,
                        "toJSON": {},
                        "top": 423,
                        "width": 443.453125,
                        "x": 8,
                        "y": 423
                    },
                    "text": "sodales. Vestibulum consectetur nulla\n    elementum eros "
                },
                {
                    "rect": {
                        "bottom": 461,
                        "height": 19,
                        "left": 8,
                        "right": 474.546875,
                        "toJSON": {},
                        "top": 442,
                        "width": 466.546875,
                        "x": 8,
                        "y": 442
                    },
                    "text": "rhoncus, non interdum diam tristique. Praesent interdum "
                },
                {
                    "rect": {
                        "bottom": 480,
                        "height": 19,
                        "left": 8,
                        "right": 470.0625,
                        "toJSON": {},
                        "top": 461,
                        "width": 462.0625,
                        "x": 8,
                        "y": 461
                    },
                    "text": "quam\n    in lacus finibus semper. Phasellus id feugiat tortor. "
                },
                {
                    "rect": {
                        "bottom": 499,
                        "height": 19,
                        "left": 8,
                        "right": 480.5625,
                        "toJSON": {},
                        "top": 480,
                        "width": 472.5625,
                        "x": 8,
                        "y": 480
                    },
                    "text": "Integer sed molestie\n    urna, a sodales libero. Morbi egestas "
                },
                {
                    "rect": {
                        "bottom": 518,
                        "height": 19,
                        "left": 8,
                        "right": 446.65625,
                        "toJSON": {},
                        "top": 499,
                        "width": 438.65625,
                        "x": 8,
                        "y": 499
                    },
                    "text": "egestas tortor sed sagittis. Aenean et\n    tellus non quam "
                },
                {
                    "rect": {
                        "bottom": 537,
                        "height": 19,
                        "left": 8,
                        "right": 286.734375,
                        "toJSON": {},
                        "top": 518,
                        "width": 278.734375,
                        "x": 8,
                        "y": 518
                    },
                    "text": "pellentesque ultrices vel non odio.\n"
                }
            ]
        ;

        assertJSON(textBlocks.value, expected);

    });

});
