import {assert} from 'chai';
import {ProgressCalculator} from './ProgressCalculator';
import {ResolvablePromise} from './ResolvablePromise';
import {TestingTime} from '../test/TestingTime';
import {Sequences} from './Sequences';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';


describe('Sequences', function() {

    it("Large machine and nonces", async function() {

        TestingTime.freeze();

        Sequences.MACHINE = 999999999999;
        Sequences.NONCE = 999999999999;

        const seq = Sequences.create();

        assert.equal(seq, "z2012-03-02T11:38:49.321Z+000000-999999999999");

    });


    it("Two issued", async function() {

        TestingTime.freeze();

        Sequences.MACHINE = 123;
        Sequences.NONCE = 0;

        assert.equal(Sequences.create(), "z2012-03-02T11:38:49.321Z+000000-000000000123");
        assert.equal(Sequences.create(), "z2012-03-02T11:38:49.321Z+000001-000000000123");

    });


    it("Small machine and nonces", async function() {

        TestingTime.freeze();

        Sequences.MACHINE = 0;
        Sequences.NONCE = 0;

        const seq = Sequences.create();

        assert.equal(seq, "z2012-03-02T11:38:49.321Z+000000-000000000000");

    });

});


