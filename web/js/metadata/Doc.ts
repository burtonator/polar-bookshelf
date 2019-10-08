import {DocInfo} from './DocInfo';
import {DatastorePermission} from '../datastore/Datastore';
import {DocMeta} from './DocMeta';
import {ObjectID} from '../util/ObjectIDs';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";


/**
 * A higher level representation of a Doc including the DocInfo and DocMeta
 * for use with providing additional metadata around DocMeta and DocInfo which
 * isn't necessarily written in the DocInfo/DocMeta including permission data.
 */
export interface Doc extends ObjectID {

    readonly docInfo: IDocInfo;

    readonly docMeta: IDocMeta;

    readonly permission: DatastorePermission;

    /**
     * True if the underlying document is mutable based on the permission
     * object and the datastore being used.
     */
    readonly mutable: boolean;

}
