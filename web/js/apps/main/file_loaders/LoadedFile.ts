import {WebResource} from '../../../electron/webresource/WebResource';
import {DocDimensions} from '../../../viewer/html/Descriptors';

export interface LoadedFile {

    readonly webResource: WebResource;

    readonly title?: string;

    /**
     * The minimum width of the window needed to host this document.
     */
    readonly docDimensions?: DocDimensions;

}
