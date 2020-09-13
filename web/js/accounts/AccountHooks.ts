import {AccountActions} from "./AccountActions";
import {useHistory} from "react-router-dom";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {useLogger} from "../mui/MUILogger";

export function useLogoutCallback() {

    const history = useHistory();
    const dialogs = useDialogManager();
    const log = useLogger();

    return () => {

        async function doAsync() {

            const progressCallback =
                await dialogs.taskbar({message: "Going to logout.  Clearing your data... one sec."})

            progressCallback({value: 'indeterminate'});

            await AccountActions.logout();

            progressCallback({value: 100});

            dialogs.snackbar({
                type: 'success',
                message: "You've been logged out!  Thanks for using Polar!"
            });

            history.push('/login');

        }

        doAsync().catch(err => log.error(err));

    };

}

export function useLoginCallback() {

    const history = useHistory()

    return () => {
        history.replace('/login');
    }

}
