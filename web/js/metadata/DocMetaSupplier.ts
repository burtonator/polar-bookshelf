import {DocMeta} from './DocMeta';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

/**
 * A (potentially) lightweight supplier of DocMeta objects.
 */
export type DocMetaSupplier = () => Promise<IDocMeta>;
