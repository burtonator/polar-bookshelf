import {assert} from 'chai';
import {Text} from "./Text";

describe('Text', function() {

    it("With no input text", async function () {

        assert.equal(Text.indent("", "    "), "    ");

    });

    it("With one line", async function () {

        assert.equal(Text.indent("hello\nworld", "  "), "  hello\n  world");

    });

    it("With two lines", async function () {

        assert.equal(Text.indent("hello\nworld\n", "  "), "  hello\n  world\n  ");

    });

    it("With one line withOUT newline", async function () {

        assert.equal(Text.indent("hello", "  "), "  hello");

    });

    it("With one line WITH newline", async function () {

        assert.equal(Text.indent("hello\n", "  "), "  hello\n  ");

    });

});
