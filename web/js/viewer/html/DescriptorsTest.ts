import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {Descriptors} from './Descriptors';
import {ScrollBox} from '../../capture/renderer/Captured';

describe('Descriptors', function() {

    describe('computeScrollBoxFromBoxes', function() {

        it("basic", async function () {

            const scrollBox: ScrollBox = {
                width: 150,
                height: 150
            }

            const scroll: ScrollBox = {
                width: 100,
                height: 100
            }

            let result = Descriptors.computeScrollBoxFromBoxes(scrollBox, scroll);

            assert.ok(result.isPresent())

            assertJSON(result, {
                "value": {
                    "width": 150,
                    "height": 150
                }
            });

        });

        it("none", async function () {

            let result = Descriptors.computeScrollBoxFromBoxes();
            assert.isFalse(result.isPresent())

        });

        it("first", async function () {

            const scrollBox: ScrollBox = {
                width: 150,
                height: 150
            }

            let result = Descriptors.computeScrollBoxFromBoxes(scrollBox);

            assert.ok(result.isPresent())

            assertJSON(result, {
                "value": {
                    "width": 150,
                    "height": 150
                }
            });

        });


        it("last", async function () {

            const scroll: ScrollBox = {
                width: 100,
                height: 100
            }

            let result = Descriptors.computeScrollBoxFromBoxes(undefined, scroll);

            assert.ok(result.isPresent())

            assertJSON(result, {
                "value": {
                    "width": 100,
                    "height": 100
                }
            });

        });


        it("broken", async function () {

            const scroll: any = {
                width: "100",
                height: 100
            }

            let result = Descriptors.computeScrollBoxFromBoxes(scroll, scroll);

            assert.isFalse(result.isPresent())

        });

    });

});
