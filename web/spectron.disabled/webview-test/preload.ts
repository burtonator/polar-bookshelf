import {Functions} from 'polar-shared/src/util/Functions';
import {IDimensions} from "../../js/util/IDimensions";

const windowDimensions: IDimensions = {
    width: 800,
    height: 1000,
};

export function defineProperty(target: any, key: string, value: any) {

    console.log(`Defining ${key} as: ${value}`);

    try {
        Object.defineProperty(target, key, {
            get: function() {
                return value;
            }
        });
    } catch (e) {
        console.warn(`Unable to define ${key}`, e);
    }

}

export function cleanupLargeVerticalHeight() {

    for (const element of Array.from(document.querySelectorAll(".Cover"))) {

        if (element instanceof HTMLElement) {
            console.log("FIXME: here", element);
            const style = window.getComputedStyle(element);

            // const matchedCSSRules = window.getMatchedCSSRules(element);
            //
            // for (const rule of Array.from(matchedCSSRules)) {
            //     console.log("FIXME: rule: ", rule);
            // }

            console.log("FIXME: style: ", style);
            console.log("FIXME: style.parentRule: ", style.parentRule);

            console.log("FIXME: style.height: " + style.height);
            if (style.height === '100vh') {
                element.style.maxHeight = '400px';
            }
        }

    }

}

export function configureBrowserWindowSize() {

    // TODO: see if I have already redefined it.  the second time fails
    // because I can't redefine a property.  I don't think there is a way
    // to find out if it's already defined though.

    const definitions = [
        {key: "width",       value: windowDimensions.width},
        {key: "availWidth",  value: windowDimensions.width},
        {key: "height",      value: windowDimensions.height},
        {key: "availHeight", value: windowDimensions.height}
    ];

    for (const definition of definitions) {
        defineProperty(window.screen, definition.key, definition.value);
    }

    defineProperty(window, 'outerWidth', windowDimensions.width);
    defineProperty(window, 'outerHeight', windowDimensions.height);

}

configureBrowserWindowSize();

console.log("Configurd browser size!");

console.log("FIXME: window.innerHeight: " + window.innerHeight);
console.log("FIXME: window.outerHeight: " + window.outerHeight);
