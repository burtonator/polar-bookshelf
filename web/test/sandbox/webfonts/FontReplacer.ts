import {StringBuffer} from '../../../js/util/StringBuffer';

export interface StandardFontIndex {
    [name: string]: FontType;
}

export interface FontType {
    type: 'sans-serif' | 'serif' | 'monospace';
}

export class FontReplacer {

    // TODO: another aporoach is to just replace the standard fonts by name...
    // this would be easier to implement.

    // FIXME: I'm not sure roboto can be displayed bold... find out...
    //
    // FIXME: monospace

    public static createFontReplacements(): string {

        const buff = new StringBuffer();

        const standardFontIndex = this.createStandardFontIndex();

        for (const fontName of Object.keys(standardFontIndex)) {
            const fontType = standardFontIndex[fontName];

            if (fontType.type === 'serif') {
                buff.append(this.createFontReplacementUsingMerriweather(fontName));
            } else if (fontType.type === 'sans-serif') {
                buff.append(this.createFontReplacementUsingRoboto(fontName));
            }

        }

        return buff.toString();

    }

    /**
     * Create a simple/easy replacement which *probably* works.
     */
    private static createFontReplacementUsingRoboto(newFontName: string) {

        return `<style id="polar-font-mapping-from-${newFontName}-to-roboto">

            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu72xKOzY.woff2) format('woff2');
              unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
            }
            /* cyrillic */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu5mxKOzY.woff2) format('woff2');
              unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            /* greek-ext */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7mxKOzY.woff2) format('woff2');
              unicode-range: U+1F00-1FFF;
            }
            /* greek */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4WxKOzY.woff2) format('woff2');
              unicode-range: U+0370-03FF;
            }
            /* vietnamese */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7WxKOzY.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
            }
            /* latin-ext */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Roboto'), local('Roboto-Regular'), url(https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }            
            
        </style>`;

    }

    private static createFontReplacementUsingMerriweather(newFontName: string) {

        return `<style id="polar-font-mapping-from-${newFontName}-to-merriweather">

            /* cyrillic-ext */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Merriweather Regular'), local('Merriweather-Regular'), url(https://fonts.gstatic.com/s/merriweather/v19/u-440qyriQwlOrhSvowK_l5-cSZMZ-Y.woff2) format('woff2');
              unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
            }
            /* cyrillic */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Merriweather Regular'), local('Merriweather-Regular'), url(https://fonts.gstatic.com/s/merriweather/v19/u-440qyriQwlOrhSvowK_l5-eCZMZ-Y.woff2) format('woff2');
              unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            /* vietnamese */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Merriweather Regular'), local('Merriweather-Regular'), url(https://fonts.gstatic.com/s/merriweather/v19/u-440qyriQwlOrhSvowK_l5-cyZMZ-Y.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
            }
            /* latin-ext */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Merriweather Regular'), local('Merriweather-Regular'), url(https://fonts.gstatic.com/s/merriweather/v19/u-440qyriQwlOrhSvowK_l5-ciZMZ-Y.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            /* latin */
            @font-face {
              font-family: '${newFontName}';
              font-style: normal;
              font-weight: 400;
              src: local('Merriweather Regular'), local('Merriweather-Regular'), url(https://fonts.gstatic.com/s/merriweather/v19/u-440qyriQwlOrhSvowK_l5-fCZM.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            
        </style>`;

    }

    /**
     * Go over all the stylesheets on the page and replace them with a new
     * stylesheet that works across platforms by replacing system fonts with
     * the same font across platforms.
     */
    public static createReplacementStylesheet() {

    }

    public static createStandardFontIndex(): StandardFontIndex {

        return {
            "sans-serif": {
                type: 'sans-serif'
            },
            "serif": {
                type: 'serif'
            },
            "monospace": {
                type: 'monospace'
            },
            "helvetica": {
                type: 'sans-serif'
            },
            "helvetica neue": {
                type: 'sans-serif'
            },
            "neue helvetica": {
                type: 'sans-serif'
            },
            "arial": {
                type: 'sans-serif'
            },
            "tehoma": {
                type: 'sans-serif'
            },
            "geneva": {
                type: 'sans-serif'
            },
            "gadget": {
                type: 'sans-serif'
            },
            "times new roman": {
                type: 'serif'
            },
            "courier new": {
                type: 'monospace'
            },
            "courier": {
                type: 'monospace'
            },
            "lucida console": {
                type: 'monospace'
            },
            "monaco": {
                type: 'monospace'
            },
            "verdana": {
                type: 'sans-serif'
            },
            "georgia": {
                type: 'serif'
            },
            "palatino": {
                type: 'serif'
            },
            "palatino linotype": {
                type: 'serif'
            },
            "book antiqua": {
                type: 'serif'
            },
            "garamond": {
                type: 'serif'
            },
            "bookman": {
                type: 'serif'
            },
            "comic sans ms": {
                type: 'sans-serif'
            },
            "trebuchet ms": {
                type: 'sans-serif'
            },
            "arial black": {
                type: 'sans-serif'
            },
            "impact": {
                type: 'sans-serif'
            },
            "charcoal": {
                type: 'sans-serif'
            },
        };

    }

}
