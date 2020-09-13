import React from 'react';
import {ConsoleLogger} from "polar-shared/src/logger/ConsoleLogger";
import {useDialogManager} from "./dialogs/MUIDialogControllers";
import {DialogManager} from "./dialogs/MUIDialogController";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ILogger} from "polar-shared/src/logger/ILogger";

/**
 * Used so that we can use our MUI error dialog if an error was raised.
 * @NotStale
 */
export function useLogger(): ILogger {
    const dialogManager = useDialogManager();
    // it's important to useMemo here or the value will change and can trigger
    // too many renders of root components and nuke performance.
    return React.useMemo(() => new MUILogger(dialogManager), [dialogManager]);
}

/**
 * Logger that just uses the DialogManager to display errors in a snackbar.
 */
class MUILogger extends ConsoleLogger {

    readonly name: string = 'mui-logger';

    constructor(private readonly dialogManager: DialogManager) {
        super();
    }

    public error(msg: string, ...args: any[]) {

        super.error(msg, ...args);

        if (args.length > 0 && args[0] instanceof Error) {

            const createMessage = () => {

                const err = args[0];

                if (err.message && err.message !== '') {
                    return err.message;
                } else {
                    return undefined;
                }

            };

            const message = createMessage();
            this.createErrorDialog(message);

        } else {
            this.createErrorDialog(msg);
        }

    }

    private createErrorDialog(msg: string | undefined) {

        const title = 'Internal Error';

        const subtitle = `An internal error has occurred: ` + (msg || 'No message given');

        this.dialogManager.confirm({
            type: 'error',
            title,
            subtitle,
            noCancel: true,
            onAccept: NULL_FUNCTION
        });

    }

}
