import {TextRect} from "./TextRect";
import {assertJSON} from "../test/Assertions";

describe('TextRect', function() {

    describe('Object as constructor', function() {

        it("basic", async function () {

            let textRect = new TextRect( {
                rect: {
                    left: 438.66666666666663,
                    top: 782.6666666666666,
                    width: 302.7884333333333,
                    height: 11.333333333333332,
                    right: 741.4550999999999,
                    bottom: 794
                },
                text: "hello world"
            });

            let expected = {
                "text": "hello world",
                "rect": {
                    "left": 438.66666666666663,
                    "top": 782.6666666666666,
                    "width": 302.7884333333333,
                    "height": 11.333333333333332,
                    "right": 741.4550999999999,
                    "bottom": 794
                }
            };

            assertJSON(textRect, expected);

        });

    });

});
