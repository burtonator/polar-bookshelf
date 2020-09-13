import React from 'react';
import {useAccountUpgrader} from "../../../../web/js/ui/account_upgrade/AccountUpgrader";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export namespace AddContentButtons {

    export function useAccountVerifiedAction() {

        const accountUpgrade = useAccountUpgrader();
        const dialogs = useDialogManager();

        return React.useCallback((delegate: () => void) => {

            if (accountUpgrade?.required) {

                dialogs.confirm({
                    title: 'Account upgrade required',
                    subtitle: `You've reach the limits of your plan and need to upgrade to ${accountUpgrade.toPlan.level}`,
                    onAccept: NULL_FUNCTION
                })

            } else {
                delegate();
            }

        }, [accountUpgrade, dialogs]);

    }


}
