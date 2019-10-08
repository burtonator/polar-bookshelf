import {FirebaseDatastores} from './FirebaseDatastores';
import {Backend} from 'polar-shared/src/datastore/Backend';
import {assertJSON} from '../test/Assertions';

describe('FirebaseDatastores', function() {

    it("basic", async function() {

        // {
        //     "path": "stash/1DkF2nhfKbnzmNaaLFo7LritFAGg5nunancvCGVe.pdf",
        //     "backend": "stash","
        //     "fileRef": {
        //         "name": "chubby.pdf",
        //         "backend": "stash"
        //     },
        //     "uid":"SSVzZnZrmZbCnavWVw6LmoVVCeA3"
        // }

        const backend = Backend.STASH;

        const fileRef = {
            name: "chubby.pdf",
            backend
        };

        const uid = "SSVzZnZrmZbCnavWVw6LmoVVCeA3";

        const storagePath = FirebaseDatastores.computeStoragePath(backend, fileRef, uid);

        assertJSON(storagePath, {
            "path": "stash/1DkF2nhfKbnzmNaaLFo7LritFAGg5nunancvCGVe.pdf",
            "settings": {
                "cacheControl": "public,max-age=604800",
                "contentType": "application/pdf"
            }
        });

    });

});
