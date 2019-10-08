import {Base64} from 'polar-shared/src/util/Base64';
import {Logger} from 'polar-shared/src/logger/Logger';

export type DataURL = string;

export interface DecodedDataURL {
    data: ArrayBuffer;
    type: string;
}

const log = Logger.create();

/**
 * Represents an data: URL as a string.
 */
export class DataURLs {

    public static decode(dataURL: DataURL): DecodedDataURL {

        try {

            // data:[<media type>][;base64],<data>

            // example:
            //
            //   data:image/png;base64,iVBOR

            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code
            // that does this

            const dataPortion = this.parseDataPortion(dataURL);

            const byteString = Base64.atob(dataPortion);

            // separate out the mime component
            const type = dataURL.substring(dataURL.indexOf(":") + 1, dataURL.indexOf(";"));

            // write the bytes of the string to an ArrayBuffer
            const ab = new ArrayBuffer(byteString.length);

            // create a view into the buffer
            const ia = new Uint8Array(ab);

            // set the bytes of the buffer to the correct values
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            return { data: ab, type };
        } catch (e) {
            log.warn("Unable to decode data URL: ", dataURL);
            throw e;
        }

    }

    public static parseDataPortion(dataURL: DataURL) {
        return dataURL.substring(dataURL.indexOf(",") + 1);
    }

    public static toBlob(data: DataURL): Blob {

        const decoded = this.decode(data);

        return new Blob([decoded.data], {type: decoded.type});

    }

}

