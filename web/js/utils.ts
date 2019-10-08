import { Preconditions } from "polar-shared/src/Preconditions";
import { Rects } from "./Rects";

export function injectScript(src: string, type?: string) {

    let script = document.createElement('script');
    script.src = src;

    // loading async is ugly but we're going to move to webpack and clean this
    // up eventually.
    script.async = false;
    script.defer = false;

    if(type) {
        script.type = type;
    }

    return new Promise(function (resolve, reject) {

        document.head.appendChild(script);

        script.addEventListener('load', function() {
            resolve();
        });

        script.addEventListener('error', function(err) {
            reject(err);
        });

    });

}

/**
 * Apply a given function, with arguments, to a list of delegates which have
 * that function name defined.
 */
export class Delegator {

    private delegates: any[]

    constructor(delegates: any[]) {
        this.delegates = delegates;
    }

    /**
     * Apply the given function to all the delegates.
     */
    public apply(functionName: string, ...rest: any[]) {

        let args = Array.from(arguments);
        args.splice(0,1);

        this.delegates.forEach(function (delegate) {
            let func = delegate[functionName];
            func.apply(delegate, args);
        });
    }

}

// @Deprecated use Functions.forDict
export function forDict(dict: any, callback: any) {

    Preconditions.assertNotNull(dict, "dict");
    Preconditions.assertNotNull(callback, "callback");

    // get the keys first, that way we can mutate the dictionary while iterating
    // through it if necessary.
    let keys = Object.keys(dict);

    keys.forEach(function (key) {
        let value = dict[key];
        callback(key,value);
    })

}

/**
 * Get the bounding box for a list of elements, not just one.  This would be
 * the minimum bounding box for all the elements.
 */
export function getBoundingClientRectFromElements(elements: any[]) {

    let boundingClientRects = elements.map(current => current.getBoundingClientRect());
    return getBoundingClientRectFromBCRs(boundingClientRects);

};

/**
 * Get the bounding box from a list of BCRs.
 */
export function getBoundingClientRectFromBCRs(boundingClientRects: any[]) {

    let left = boundingClientRects.map((brc) => brc.left).reduce((a,b) => Math.min(a,b));
    let top = boundingClientRects.map((brc) => brc.top).reduce((a,b) => Math.min(a,b));
    let bottom = boundingClientRects.map((brc) => brc.bottom).reduce((a,b) => Math.max(a,b));
    let right = boundingClientRects.map((brc) => brc.right).reduce((a,b) => Math.max(a,b));

    return {left, top, bottom, right};

};

/**
 * @Deprecated use Elements.offset instead.
 */
export function elementOffset(element: any) {

    let result = {
        left: element.offsetLeft,
        top: element.offsetTop,
        width: element.offsetWidth,
        height: element.offsetHeight,
        right: 0,
        bottom: 0
    };

    result.right = result.left + result.width;
    result.bottom = result.top + result.height;

    return Rects.validate(result);

}

/**
 * Support the ability to calculate an offset relative to another element.
 */
export class OffsetCalculator{

    // https://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
    static calculate(element: any, rootElement: any) {

        let offset = {left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0};

        while(true) {

            if(element == null)
                break;

            offset.left += this._toInt(element.offsetLeft);
            offset.top += this._toInt(element.offsetTop);
            offset.width = this._toInt(element.offsetWidth);
            offset.height = this._toInt(element.offsetHeight);

            if(element === rootElement)
                break;

            element = element.offsetParent;

        }

        offset.right = offset.left + offset.width;
        offset.bottom = offset.top + offset.height;

        return Rects.validate(offset);

    }

    static _toInt(value: any) {

        if ( isNaN( value ) ) {
            return 0;
        }

        return value;

    }

}

export class Styles {

    static parseTransformScaleX(transform: any) {

        let result = transform;

        if( ! result)
            return null;

        result = result.replace("scaleX(", "");
        result = result.replace(")", "");

        return parseFloat(result);

    }

    /**
     * Take a string of '50px' and return a number of just the pixel count.
     */
    static parsePixels(value: any) {

        value = value.replace("px", "");
        return parseInt(value);

    }

}
