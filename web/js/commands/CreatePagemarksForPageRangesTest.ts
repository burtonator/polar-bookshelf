import {assert} from 'chai';
import {DiskDatastore} from '../datastore/DiskDatastore';
import {CreatePagemarksForPageRanges} from './CreatePagemarksForPageRanges';
import {DefaultPersistenceLayer} from '../datastore/DefaultPersistenceLayer';

xdescribe('Create ranges', function() {

    xdescribe('with real data', function() {

        xit("my bitcoin book.", async function() {

            const datastore = new DiskDatastore();
            const persistenceLayer = new DefaultPersistenceLayer(datastore);

            await persistenceLayer.init();

            const fingerprint = "65393761393531623135393737626562666234373866653365396535313036623631346666376461623662383239616439666637353064393132643133353030";

            const docMeta = await persistenceLayer.getDocMeta(fingerprint);

            assert.ok(docMeta !== undefined)

            const createPagemarksForPageRanges = new CreatePagemarksForPageRanges(docMeta!);

            createPagemarksForPageRanges.execute({range: {start: 1, end: 204}});

            await persistenceLayer.write(fingerprint, docMeta!);

            // to 204...

            // FIXME: now get the DocMeta

            // now create the ranges.

            // now commit it back out...

        });

    });

});
