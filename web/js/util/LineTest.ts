import {assert} from 'chai';
import {Line} from './Line';
import {assertJSON} from '../test/Assertions';

describe('Line', function() {

    it("length", function() {

        const line = new Line(10, 20);
        assert.equal(line.length, 10);

        const expected = {
            "start": 10,
            "end": 20,
            "length": 10
        };

        assertJSON(line, expected, undefined, true);

    });

});
