import {LoadDocRequest} from './LoadDocRequest';

export interface IDocLoader {

    create(loadDocRequest: LoadDocRequest): IDocLoadRequest;

}

/**
 * Do the actual load now.
 */
export interface IDocLoadRequest {
    load(): Promise<void>;
}
