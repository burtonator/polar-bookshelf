import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export interface LoadDocRequest {

    readonly fingerprint: string;

    readonly backendFileRef: BackendFileRef;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

}
