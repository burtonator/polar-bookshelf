import {assert} from 'chai';
const isEqual = require("react-fast-compare");

describe('DeepPureComponent', function() {

    it('basic', function() {

        const myFunction0 = () => 1 + 1;
        const myFunction1 = () => 1 + 2;

        // compare this with functions and it should work just fine.
        assert.isTrue(isEqual({func: myFunction0}, {func: myFunction0}));
        assert.isFalse(isEqual({func: myFunction0}, {func: myFunction1}));

    });

});
