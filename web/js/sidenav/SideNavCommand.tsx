import * as React from "react";
import {ICommand, MUICommandMenu} from "../mui/command_menu/MUICommandMenu";
import {TabDescriptor, useSideNavCallbacks, useSideNavStore} from "./SideNavStore";
import {GlobalKeyboardShortcuts, keyMapWithGroup} from "../keyboard_shortcuts/GlobalKeyboardShortcuts";
import {MUIDialog} from "../ui/dialogs/MUIDialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Devices} from "polar-shared/src/util/Devices";

const useStyles = makeStyles((theme) =>
    createStyles({
        dialog: {
            fontSize: '1.3rem',
        },
        commandMenu: {
            fontSize: '1.3rem',
            minHeight: 'min(80vh, 500px)',
            maxHeight: 'min(80vh, 500px)',
            minWidth: 'min(80vw, 700px)',
            maxWidth: 'min(80vw, 700px)',
            margin: theme.spacing(1)
        },
    }),
);

const globalKeyMap = keyMapWithGroup(
    {
        group: "Documents",
        keyMap: {
            ACTIVATE: {
                name: "Jump to Open Document",
                description: "Jump to open doc",
                sequences: ['shift+command+e', 'shift+ctrl+E'],
            },
        }
    });

export const SideNavCommandMenu = () => {

    const classes = useStyles();
    const {tabs, activeTab} = useSideNavStore(['tabs', 'activeTab']);
    const {setActiveTab} = useSideNavCallbacks();

    const [active, setActive] = React.useState(false);

    const commandsProvider = React.useCallback(() => {

        function toCommand(tab: TabDescriptor): ICommand {
            return {
                id: tab.id,
                text: tab.title
            }
        }

        return arrayStream(tabs).sort((a,b) => a.lastActivated.localeCompare(b.lastActivated))
                                .filter(current => current.id !== activeTab)
                                .reverse()
                                .map(toCommand)
                                .collect();

    }, [activeTab, tabs]);

    const globalKeyHandlers = {
        ACTIVATE: () => setActive(true),
    };

    const handleCommand = React.useCallback((command: ICommand) => {
        setActiveTab(command.id);
    }, [setActiveTab]);


    if (! Devices.isDesktop()) {
        // only activate on desktop.
        return null;
    }

    return (
        <>

            <GlobalKeyboardShortcuts keyMap={globalKeyMap}
                                     handlerMap={globalKeyHandlers}/>

            <MUIDialog open={active}
                       className={classes.dialog}
                       maxWidth="md">

                <MUICommandMenu onCommand={handleCommand}
                                title="Open Documents"
                                className={classes.commandMenu}
                                onClose={() => setActive(false)}
                                commandsProvider={commandsProvider}/>

            </MUIDialog>

        </>
    );

}
