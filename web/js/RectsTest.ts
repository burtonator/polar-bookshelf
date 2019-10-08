import {assert} from 'chai';
import {Rects} from './Rects';
import {assertJSON} from './test/Assertions';
import {Rect} from './Rect';
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {RectArt} from './util/RectArt';
import {MOCK_RECTS} from './MockRects';

describe('Rects', function() {

    describe('perc', function() {

        it("basic perc", function () {

            const a = Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 50,
                height: 50
            });

            const b = Rects.createFromBasicRect({
                top: 0,
                left: 0,
                width: 100,
                height: 100
            });

            const actual = Rects.perc(a, b);

            const expected = {
                "left": 0,
                "top": 0,
                "right": 50,
                "bottom": 50,
                "width": 50,
                "height": 50
            };

            assertJSON(actual, expected);

        });


    });


    describe('scale', function() {

        it("basic scale", function () {

            let rect = new Rect({
                top: 100,
                left: 100,
                bottom: 200,
                right: 200,
                width: 100,
                height: 100,
            });

            let actual = Rects.scale(rect, 2.0);

            let expected = {
                "left": 200,
                "top": 200,
                "right": 400,
                "bottom": 400,
                "width": 200,
                "height": 200
            };

            assertJSON(actual, expected);

        });


    });


    describe('intersect + overlap', () => {

        test("not_intersected", false, false);
        test("basic_test", true, true);
        test("intersected_right", true, true);
        test("intersected_left", true, true);
        test("intersected_top", true, true);
        test("intersected_bottom", true, true);
        test("intersected_bottom_left", true, true);

        //test("overlap_rect0_over_rect1", false, true);

        /**
         *
         * @param name {string} The name of the test and the data to extract.
         * @param expectedIntersect {boolean}
         * @param expectedOverlap {boolean}
         */
        function test(name: string, expectedIntersect: boolean, expectedOverlap: boolean) {

            it(name, () => {

                let rects = MOCK_RECTS[name];

                console.log("\n" + RectArt.formatRects([rects.rect0, rects.rect1]).toString());

                assert.equal(Rects.intersect(rects.rect0, rects.rect1), expectedIntersect);
                assert.equal(Rects.overlap(rects.rect0, rects.rect1), expectedOverlap);

            });

        }

    });


    describe('intersectedPositions', function() {

        it("not intersected", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 300,
                "top": 300,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), []);

        });

        it("intersected right", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 150,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["right", "top", "bottom"]);

        });

        it("intersected left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 100,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "top", "bottom"]);

        });


        it("intersected top", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 50,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "top"]);

        });

        it("intersected bottom", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 100,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "right", "bottom"]);

        });

        it("intersected bottom left", function () {

            let rect0 = Rects.createFromBasicRect({
                "left": 100,
                "top": 100,
                "width": 100,
                "height": 100
            });

            let rect1 = Rects.createFromBasicRect({
                "left": 50,
                "top": 150,
                "width": 100,
                "height": 100
            });

            assertJSON(Rects.intersectedPositions(rect0, rect1), ["left", "bottom"]);

        });

    });

});
