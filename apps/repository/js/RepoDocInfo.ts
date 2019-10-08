/**
 * Just like a DocDetail or DocInfo but designed to be used for in the UI so we
 * replace missing titles with Untitled and define other default values.
 */
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Hashcode} from 'polar-shared/src/metadata/Hashcode';
import {Tag} from '../../../web/js/tags/Tags';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";

export interface RepoDocInfo {

    readonly fingerprint: string;

    readonly title: string;

    readonly progress: number;

    readonly filename?: string;

    readonly added?: ISODateTimeString;

    readonly lastUpdated?: ISODateTimeString;

    // lastUpdated?: string;

    flagged: boolean;

    archived: boolean;

    readonly url?: string;

    // nrComments: number;
    // nrFlashcards: number;

    readonly tags?: Readonly<{[id: string]: Tag}>;

    readonly nrAnnotations: number;

    readonly hashcode?: Hashcode;

    readonly site?: string;

    /**
     * The original DocInfo used to construct this RepoDocInfo.
     */
    readonly docInfo: IDocInfo;

}


