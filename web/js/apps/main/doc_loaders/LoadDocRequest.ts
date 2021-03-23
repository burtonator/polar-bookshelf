import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {IAnnotationPtr} from "../../../annotation_sidebar/AnnotationPtrs";

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

    /**
     * An annotation pointer. Used to scroll to an annotation after the document has loaded
     */
    readonly annotationPtr?: IAnnotationPtr;
}
