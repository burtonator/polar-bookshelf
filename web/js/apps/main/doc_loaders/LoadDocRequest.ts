import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export interface LoadDocRequest {

    readonly title: string;

    readonly fingerprint: string;

    /**
     * The URL for this document.  Used for migration purposes.
     */
    readonly url: string | undefined;

    readonly backendFileRef: BackendFileRef;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

    // TODO: extend with page and annotation parameters.

}
