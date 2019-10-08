import {DocMeta} from './DocMeta';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {PageMeta} from './PageMeta';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export class DocMetaMerger {

    public static merge(primary: IDocMeta, ...secondaries: ReadonlyArray<IDocMeta>) {

        // the primary contains the main document changes.

        // the secondary docMetas contain what we need to merge/copy over.
        const result = <IDocMeta> Dictionaries.deepCopy(primary);

        for (const secondary of secondaries) {

            deepCopyInto(result.attachments, secondary.attachments);

            for (const key of Dictionaries.numberKeys(primary.pageMetas)) {

                const src = primary.pageMetas[key];
                const dest = result.pageMetas[key];
                deepCopyPageMeta(src, dest);

            }

        }

        return result;

    }

}

function deepCopyPageMeta(src: IPageMeta, dest: IPageMeta) {
    // pagemarks and reading progress should not be copied over.

    deepCopyInto(src.textHighlights, dest.textHighlights);
    deepCopyInto(src.areaHighlights, dest.areaHighlights);
    deepCopyInto(src.notes, dest.notes);
    deepCopyInto(src.comments, dest.comments);
    deepCopyInto(src.questions, dest.questions);
    deepCopyInto(src.flashcards, dest.flashcards);

}

function deepCopyInto(src: ObjectMap, target: ObjectMap) {

    if (! src) {
        return;
    }

    for (const key of Object.keys(src)) {
        target[key] = src[key];
    }

}

interface ObjectMap {
    [key: string]: object;
}

