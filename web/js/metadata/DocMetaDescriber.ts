import {DocMeta} from './DocMeta';
import {forDict} from 'polar-shared/src/util/Functions';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class DocMetaDescriber {

    public static describe(docMeta: IDocMeta) {

        let nrPagemarks = 0;
        let nrTextHighlights = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (id, pagemark) => {
                ++nrPagemarks;
            });

            forDict(pageMeta.textHighlights, (id, textHighlight) => {
                ++nrTextHighlights;
            });

        });

        return `Doc stats - pages: ${docMeta.docInfo.nrPages}, text highlights: ${nrTextHighlights}, pagemarks: ${nrPagemarks}`;

    }

}
