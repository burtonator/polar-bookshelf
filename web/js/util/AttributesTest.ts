import {assert} from 'chai';
import {Attributes} from './Attributes';
import {JSDOM} from 'jsdom';

describe('Attributes', function() {

    describe('parse', function() {

        // must be disabled for now as JSDOM uses 100% cpu during tests.
        it("get", function() {

            const dom = new JSDOM("<body><div data-foo='bar' data-cat-dog='dog' data-one-two-three-four='dog'></div></body>");

            console.log(dom.window.document.body.firstChild);

            const body = dom.window.document.body;

            const div = <HTMLElement> body.firstElementChild;

            const dataAttributeMap = Attributes.dataToMap(div);

            assert.deepEqual(dataAttributeMap, {
                foo: 'bar',
                catDog: 'dog',
                oneTwoThreeFour: 'dog'
            });

        });

    });

});
