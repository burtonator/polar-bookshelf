import {BufferWriter} from './BufferWriter';
import {assert} from 'chai';

describe('BufferWriter', function() {

    it("basic", async function() {

        const writer = new BufferWriter();

        await writer.write("hello");
        await writer.write("world");

        await writer.close();

        assert.equal(writer.toString(), "helloworld");

    });

    it("no data", async function() {

        const writer = new BufferWriter();

        await writer.close();

        assert.equal(writer.toString(), "");

    });

    it("one write", async function() {

        const writer = new BufferWriter();
        await writer.write("hello");

        await writer.close();

        assert.equal(writer.toString(), "hello");

    });

});

