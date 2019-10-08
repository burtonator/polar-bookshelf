import {IDimensions} from "../../util/IDimensions";

// declare var window: any;

// TODO: pass in more arguments here including the capture options that are
// currently set by the user.  This way we could disable features like the
// vertical height detection and we could also enable features like ad blocking
// but right now the ad blocking works as part of the CAPTURE stage, not the
// preview stage.

/** @ElectronRendererContext */
export function configureBrowser(windowDimensions: IDimensions) {

    const ENABLE_VH_HANDLING = true;

    const VH_HANDLING_REQUIRE_CHILDREN: boolean = false;

    const VH_HANDLING_STRATEGY: 'auto' | 'max-height' = 'auto';

    function defineProperty(target: any, key: string, value: any) {

        console.log(`Defining ${key} as: ${value} on: `, target);

        try {
            Object.defineProperty(target, key, {
                get: () => {
                    return value;
                }
            });
        } catch (e) {
            console.warn(`Unable to define ${key}`, e);
        }

    }

    // noinspection TsLint
    function configureBrowserWindowSize(windowDimensions: IDimensions) {

        console.log("Configuring browser window size...");

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


    function writeStyles(id: string, cssText: string) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = id;
        styleElement.innerHTML = cssText;
        // FIXME: this is broken right now and we have to compute the right head location
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    function defineMaxHeightStylesheet(rule: string) {

        // TODO: I need to consider if it's not just better to measure the
        // viewport height and replace it myself.  It is probably a bad idea
        // so set this too small and will break in a lot of use cases.

        const cssText = `
        ${rule} {
            max-height: 400px;        
        }
        `;

        writeStyles('polar-vh-max-height', cssText);

    }

    function isVHProp(name: string, value: string | null) {

        const regex = /^[0-9]+VH$/gi;

        const val = value || "";

        return val.match(regex) !== null;

    }

    function isVHRule(rule: CSSStyleRule) {

        const height: string = rule.style.height || "";
        const minHeight: string = rule.style.minHeight || "";

        return isVHProp('height', height) || isVHProp('min-height', minHeight);

    }

    function defineAutoStylesheetForVH(rule: CSSStyleRule) {

        // TODO: I need to consider if it's not just better to measure the
        // viewport height and replace it myself.  It is probably a bad idea
        // so set this too small and will break in a lot of use cases.

        function defineStyle(cssPropertyValue: string | null,
                             cssPropertyName: string) {

            if (isVHProp(cssPropertyName, cssPropertyValue)) {

                console.log(`Defining CSS auto style for: ${cssPropertyName}`);

                const cssText = `
                ${rule.selectorText} {
                    ${cssPropertyName}: auto !important;        
                }
                `;

                writeStyles(`polar-vh-auto-${cssPropertyName}`, cssText);

            }

        }

        defineStyle(rule.style.minHeight, 'min-height');
        defineStyle(rule.style.height, 'height');

    }

    function configureWhiteBackground() {
        const cssText = `
        html, body {
            background-color: #FFF;        
        }
        `;

        writeStyles('polar-white-background', cssText);

        console.log("Configured white background");

    }

    function configureMaxVerticalHeight() {

        if (! ENABLE_VH_HANDLING) {
            console.log("VH truncation disabled");
            return;
        }

        console.log("Configuring max vertical height...");

        for (const stylesheet of Array.from(document.styleSheets)) {

            const rules: CSSStyleRule[] = (<any> stylesheet).rules;

            for (const rule of rules) {

                if (rule.style && isVHRule(rule)) {

                    console.log(`Found VH rule to override (follows): ${rule.selectorText}`);

                    // now verify that the elements we would block quality.

                    const matchingElements = document.querySelectorAll(rule.selectorText);

                    let elementsQualify = true;

                    if (VH_HANDLING_REQUIRE_CHILDREN) {

                        for (const matchingElement of Array.from(matchingElements)) {
                            if (matchingElement.childNodes.length > 0) {
                                console.log("Selector does not quality for as it has child nodes");
                                elementsQualify = false;
                                break;
                            }
                        }

                    }

                    if (elementsQualify) {

                        console.log("Handling VH with strategy: " + VH_HANDLING_STRATEGY);

                        if (VH_HANDLING_STRATEGY === 'max-height') {
                            defineMaxHeightStylesheet(rule.selectorText);
                        } else {
                            defineAutoStylesheetForVH(rule);
                        }
                    }

                }

            }

        }

    }

    function configureSelectionCSS() {

        const cssText = `
            ::selection {
                background-color: rgb(180, 216, 252) !important;
                color: #111111 !important;
            }
        `;

        writeStyles(`polar-css-selection`, cssText);

    }

    try {

        // configureWhiteBackground();
        configureBrowserWindowSize(windowDimensions);
        configureMaxVerticalHeight();
        configureSelectionCSS();

    } catch (e) {
        console.error("Failed to execute script: ", e);
    }

}




