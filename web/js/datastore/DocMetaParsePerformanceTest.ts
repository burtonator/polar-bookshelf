import {DiskDatastore} from './DiskDatastore';

import os from 'os';
import {Stopwatch} from '../util/Stopwatch';
import {Stopwatches} from '../util/Stopwatches';
import {DocMetas} from '../metadata/DocMetas';

const tmpdir = os.tmpdir();

xdescribe("DocMetaParsePerformance", async function() {

    xit("basic", async function() {

        const datastore = new DiskDatastore();
        await datastore.init();

        let stopwatch: Stopwatch = Stopwatches.create();
        const docMetaRefs = await datastore.getDocMetaRefs();
        console.log("getDocMetaRefs: "  + stopwatch.stop());

        console.log("Found N docMetas: " + docMetaRefs.length);

        stopwatch = Stopwatches.create();

        for (const docMetaRef of docMetaRefs) {
            const data = await datastore.getDocMeta(docMetaRef.fingerprint);
            if (data) {
                const docMeta = DocMetas.deserialize(data, docMetaRef.fingerprint);
            }
        }

        console.log("getDocMeta for each DocMetaRef: " + stopwatch.stop());

    });

});
