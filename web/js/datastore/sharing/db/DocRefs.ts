import {DocIDStr} from '../rpc/GroupProvisions';
import {DocMeta} from '../../../metadata/DocMeta';
import {DocRef} from 'polar-shared/src/groups/DocRef';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class DocRefs {

    public static fromDocMeta(docID: DocIDStr, docMeta: IDocMeta): DocRef {

        return {
            docID,
            fingerprint: docMeta.docInfo.fingerprint,
            title: docMeta.docInfo.title || "",
            subtitle: docMeta.docInfo.subtitle,
            nrPages: docMeta.docInfo.nrPages,
            description: docMeta.docInfo.description,
            url: docMeta.docInfo.url,
            // TODO: only accept regular tags and non-special key/value tags.
            tags: docMeta.docInfo.tags,
            published: docMeta.docInfo.published,
            doi: docMeta.docInfo.doi
        };

    }

    public static copyToDocInfo(docRef: DocRef, docInfo: IDocInfo): IDocInfo {

        docInfo.fingerprint = docRef.fingerprint;
        docInfo.title = docRef.title;
        docInfo.subtitle = docRef.subtitle;
        docInfo.nrPages = docRef.nrPages;
        docInfo.description = docRef.description;
        docInfo.url = docRef.url;
        docInfo.tags = docRef.tags;
        docInfo.published = docRef.published;
        docInfo.doi = docRef.doi;

        return docInfo;

    }

}
