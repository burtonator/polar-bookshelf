import {Doc} from './Doc';
import {DatastorePermission} from '../datastore/Datastore';
import {DocMeta} from './DocMeta';
import {ObjectIDs} from '../util/ObjectIDs';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class Docs {

    public static create(docMeta: IDocMeta, permission: DatastorePermission): Doc {

        const mutable = permission.mode === 'rw';

        return {
            oid: ObjectIDs.create(),
            docMeta,
            docInfo: docMeta.docInfo,
            permission,
            mutable
        };

    }

}
