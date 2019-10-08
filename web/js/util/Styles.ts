import {Preconditions} from 'polar-shared/src/Preconditions';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Strings} from "polar-shared/src/util/Strings";

export class Styles {

    /**
     * Parse the amount of pixels from the given value.  Right now we only
     * support px but in the future we could support other types.
     *
     */
    static parsePX(value: string | null | undefined): number {

        Preconditions.assertNotNull(value, "value");

        if(Strings.empty(value)) {
            throw new Error("Empty string given");
        }

        return parseInt(value!.replace("px", ""));
    }

    /**
     * Return the top, left, width, and height of the given element.
     *
     */
    public static positioning(element: HTMLElement) {

        const result: Positioning = {
            left: undefined,
            top: undefined,
            right: undefined,
            bottom: undefined,
            width: undefined,
            height: undefined,
        };

        Object.keys(result).forEach(key => {

            if (result.hasOwnProperty(key)) {

                result[key] = Optional.of(element.style.getPropertyValue(key))
                    .filter(current => current !== null && current !== undefined)
                    .map((current: any): string => current.toString())
                    .filter(current => current !== null && current !== "")
                    .getOrUndefined();
            }

        });

        return result;

    }



    /**
     * Return all the positioning keys to pixels.
     */
    static positioningToPX(positioning: Positioning): PositioningPX {

        let result: PositioningPX = {
            left: undefined,
            top: undefined,
            right: undefined,
            bottom: undefined,
            width: undefined,
            height: undefined,
        };

        for(let key in positioning) {

            if(! positioning.hasOwnProperty(key)) {
                continue;
            }

            result[key] = Optional.of(positioning[key])
                .map(current => Styles.parsePX(current))
                .getOrUndefined();

        }

        return result;

    }

}

type PositioningIndex = {[key: string]: string | undefined}

export interface Positioning extends PositioningIndex {
    left: string | undefined,
    top: string | undefined,
    right: string | undefined,
    bottom: string | undefined,
    width: string | undefined,
    height: string | undefined,
}

type PositioningPXIndex = {[key: string]: number | undefined}

export interface PositioningPX extends PositioningPXIndex {
    left: number | undefined,
    top: number | undefined,
    right: number | undefined,
    bottom: number | undefined,
    width: number | undefined,
    height: number | undefined,
}





