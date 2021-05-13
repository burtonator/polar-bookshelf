import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {GlobalCss} from "./css/GlobalCss";
import * as React from "react";
import {GlobalCssSummernote} from "./css/GlobalCssSummernote";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {KeyboardShortcuts} from "../keyboard_shortcuts/KeyboardShortcuts";
import {UndoQueueProvider2} from "../undo/UndoQueueProvider2";
import useLocalStorageState from 'use-local-storage-state'
import {MUIErrorBoundary} from "./MUIErrorBoundary";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = React.memo(function MUIAppRoot(props: IProps) {

    const [theme, setTheme] = useLocalStorageState<ThemeType>('theme', "dark");

    const muiTheme = React.useMemo(() => {

        const background = Dictionaries.onlyDefinedProperties({
            'default': theme === 'light' ? '#ffffff' : undefined,
            'paper': theme === 'light' ? '#f2f2f2' : undefined
        });

        return createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: {
                type: theme,
                primary: {
                    'main': 'rgb(103, 84, 214)'
                },
                background
                // divider: '#303236',
                // text: {
                //     primary: 'rgb(247, 248, 248)'
                // }
            }
        });

    }, [theme]);

    return (
        <>
            <KeyboardShortcuts/>
            <ThemeProvider theme={muiTheme}>
                <MUIThemeTypeContext.Provider value={{theme, setTheme}}>
                    <>
                        <CssBaseline/>
                        <GlobalCss/>
                        <GlobalCSSBootstrap/>
                        <GlobalCssSummernote/>
                        <GlobalCssMobile/>

                        <UndoQueueProvider2>
                            <MUIErrorBoundary>
                                <>
                                    {props.children}
                                </>
                            </MUIErrorBoundary>
                        </UndoQueueProvider2>

                    </>
                </MUIThemeTypeContext.Provider>
            </ThemeProvider>
        </>
    );

});
