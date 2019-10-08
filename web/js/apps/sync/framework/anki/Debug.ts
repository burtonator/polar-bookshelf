import {Logger} from 'polar-shared/src/logger/Logger';
import {AnkiSyncEngine} from './AnkiSyncEngine';
import {MockDocMetas} from '../../../../metadata/DocMetas';
import {MockFlashcards} from '../../../../metadata/Flashcards';
import {DocMetaSet} from '../../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';

const log = Logger.create();

async function exec() {

    // create a fake DocMeta with flashcards and sync it to Anki and see if it
    // works
    //
    // let docMeta = MockDocMetas.createMockDocMeta();
    // docMeta.docInfo.title = 'Mock document';
    //
    // docMeta = MockFlashcards.attachFlashcards(docMeta);
    //
    // let ankiSyncEngine = new AnkiSyncEngine();
    //
    // let docMetaSet = new DocMetaSet(docMeta);
    //
    // let syncProgressListener: SyncProgressListener = syncProgress => {
    //     console.log(syncProgress);
    // };
    //
    // let pendingSyncJob = ankiSyncEngine.sync(docMetaSet, syncProgressListener);
    //
    // await pendingSyncJob.start();

}

exec()
    .then(() => log.info("done"))
    .catch(err => log.error("Failed: ", err));
