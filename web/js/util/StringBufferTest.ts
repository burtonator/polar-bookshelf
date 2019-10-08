import {assert} from 'chai';
import {StringBuffer} from "./StringBuffer";


describe('StringBuffer', function() {

    it("basic", async function() {

        assert.equal(new StringBuffer().toString(), '');
        assert.equal(new StringBuffer().append('hello').toString(), 'hello');
        assert.equal(new StringBuffer().append('hello', 'world').toString(), 'helloworld');
        assert.equal(new StringBuffer().append('hello').append('world').toString(), 'helloworld');

    });

});

