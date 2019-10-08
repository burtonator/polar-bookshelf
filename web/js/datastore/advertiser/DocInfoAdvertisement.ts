import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';

export interface DocInfoAdvertisement {
    readonly docInfo: IDocInfo;
    readonly advertisementType: AdvertisementType;
}

export type AdvertisementType = 'created' | 'updated' | 'deleted';

export type DocInfoAdvertisementListener = (docInfoAdvertisement: DocInfoAdvertisement) => void;
