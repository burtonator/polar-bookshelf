import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {PREF_PDF_DARK_MODE_OPTIONS} from "../../../../repository/js/configure/settings/SettingsScreen";
import {usePrefsContext} from "../../../../repository/js/persistence_layer/PrefsContext2";

export const GlobalCssDarkStyles = withStyles((theme) => {

    return {

        '@global': {

            ".pdfViewer .page": {
                backgroundColor: `${theme.palette.background.default} !important`
            },

            ".pdfViewer .highlight": {
                backgroundColor: 'rgba(255, 255, 0, 1) !important'
            }

        },

    }

});

export const GlobalCssDarkForInvertStyles = withStyles((theme) => {

    return {

        '@global': {

            ".page canvas": {
                // filter: "invert(0.85)"
                // filter: "invert(64%) contrast(228%) brightness(80%) hue-rotate(180deg)"
                // filter: "invert(64%) contrast(228%) brightness(100%) hue-rotate(180deg)"
                filter: "invert(64%) contrast(228%) brightness(100%) hue-rotate(180deg)"
            },


        },

    }

});

export const GlobalCssDarkForInvertGreyscaleStyles = withStyles((theme) => {

    return {

        '@global': {

            ".page canvas": {
                filter: "invert(0.85) grayscale(1)"
            },


        },

    }

});

export const GlobalCssDark = GlobalCssDarkStyles(() => null);
export const GlobalCssDarkForInvert = GlobalCssDarkForInvertStyles(() => null);
export const GlobalCssDarkForInvertGreyscale = GlobalCssDarkForInvertGreyscaleStyles(() => null);

export const GlobalPDFCss = React.memo(function GlobalPDFCss() {

    const theme = useTheme();
    const prefs = usePrefsContext();

    const mode = prefs.get('dark-mode-pdf').getOrElse(PREF_PDF_DARK_MODE_OPTIONS[0].id)

    return (
        <>

            {theme.palette.type === 'dark' &&
                <GlobalCssDark/>}

            {theme.palette.type === 'dark' && mode === 'invert' &&
                <GlobalCssDarkForInvert/>}

            {theme.palette.type === 'dark' && mode === 'invert-greyscale' &&
                <GlobalCssDarkForInvertGreyscale/>}


        </>
    );

});

