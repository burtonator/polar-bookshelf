import {assertJSON} from "../../../../test/Assertions";
import {MediaContents} from "./MediaContents";
import {ModelNames} from "./ModelNames";
import {assert} from 'chai';

describe('ModelNames', function() {

    it("basic", async function() {

        ModelNames.verifyRequired(['Cloze', 'Basic']);
        ModelNames.verifyRequired(['Cloze', 'Basic', 'foo', 'bar']);

        assert.throws(() => ModelNames.verifyRequired(['foo', 'bar']));
        assert.throws(() => ModelNames.verifyRequired(['foo', 'bar', 'Cloze']));
        assert.throws(() => ModelNames.verifyRequired(['foo', 'bar', 'Basic']));

    });

});
