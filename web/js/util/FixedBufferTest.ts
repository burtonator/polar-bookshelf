import {Fingerprints} from './Fingerprints';

import {assert} from 'chai';
import {FixedBuffer} from './FixedBuffer';

describe('FixedBuffer', function() {

    it("basic", async function() {

        const buffer = new FixedBuffer<string>(2);

        const toText = () => {
            return buffer.toView().join("\n");
        };

        assert.equal(toText(), "");

        buffer.write("0");

        assert.equal(toText(), "0");

        buffer.write("1");

        assert.equal(toText(), "0\n1");

        buffer.write("2");

        assert.equal(toText(), "1\n2");

    });

});
