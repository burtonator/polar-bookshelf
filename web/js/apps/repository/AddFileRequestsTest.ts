
import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {AddFileRequests} from './AddFileRequests';

describe('AddFileRequests', function() {

    it('with encoded URL', function() {

        const url = "https://us-central1-polar-cors.cloudfunctions.net/cors?url=http%3A%2F%2Fwww.seanriddle.com%2Ffurbysource.pdf";
        const actual = AddFileRequests.fromURL(url);

        assertJSON(actual, {
            "basename": "furbysource.pdf",
            "docPath": "https://us-central1-polar-cors.cloudfunctions.net/cors?url=http%3A%2F%2Fwww.seanriddle.com%2Ffurbysource.pdf"
        });

    });

    it('with basic URL', function() {

        const url = "https://example.com/furbysource.pdf";
        const actual = AddFileRequests.fromURL(url);

        assertJSON(actual, {
            "basename": "furbysource.pdf",
            "docPath": "https://example.com/furbysource.pdf"
        });

    });

});
