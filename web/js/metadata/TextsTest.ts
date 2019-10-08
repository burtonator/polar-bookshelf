import {TextType} from './TextType';
import {Texts} from './Texts';
import {assertJSON} from '../test/Assertions';

describe('Texts', function() {

    it("basic", async function() {

        const text = Texts.create("asdf", TextType.HTML);

        const expected = {
            "HTML": "asdf"
        };

        assertJSON(text, expected);

    });

    xit("toText", async function() {

        const input = Texts.create("<p>this is <b>the</b>text</p>", TextType.HTML);

        const expected = {
            "HTML": "asdf"
        };

        assertJSON(Texts.toPlainText(input), "");

    });

});
