import {assert} from "chai";
import {ArgsParser} from "./ArgsParser";

describe('ArgsParser', function() {

    describe('_toKey', function() {

        it("basic", function () {

            assert.equal(ArgsParser._toKey("--foo"), "foo");

        });

        it("basic with upper", function () {
            assert.equal(ArgsParser._toKey("--enable-foo"), "enableFoo");
        });

    });

    describe('parse', function() {

        it("basic", function () {

            let args = ArgsParser.parse(["foo", "bar", "--cat=dog", "--enable-foo=true"]);

            assert.deepEqual(args, {
                cat: 'dog',
                enableFoo: true
            });

        });

    });


});
