import {DocMeta} from '../../metadata/DocMeta';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

export interface DocMetaSync {
    readonly fingerprint: string;
    readonly docMeta: IDocMeta;
}
