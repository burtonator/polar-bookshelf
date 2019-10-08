import {URLStr} from "polar-shared/src/util/Strings";

/**
 * Image src with width, height, and URL.
 */
export interface Img {
    readonly width: number;
    readonly height: number;
    readonly src: URLStr;
}
