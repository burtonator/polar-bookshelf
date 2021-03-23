import * as React from 'react';
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {ExtendedDeviceInfo} from "../repo_header/DeviceInfo";
import Button from '@material-ui/core/Button';
import {useHistory} from "react-router-dom";

const LogsButton = () => {

    const history = useHistory();

    const onLogs = React.useCallback(() => {
        history.push('/logs');
    }, [history]);


    return (
        <Button variant="contained" onClick={onLogs}>
            Logs
        </Button>
    )

}

export const DeviceScreen = React.memo(function DeviceScreen() {
    return (

        <DefaultPageLayout>

            <div className=" text-lg">

                <div className="">
                    <h2>Device</h2>

                    <p>
                        Information about the user's current device.
                    </p>

                    <div className="mt-1">
                        <ExtendedDeviceInfo/>
                    </div>

                    <div>
                        <LogsButton/>
                    </div>

                </div>

            </div>

        </DefaultPageLayout>

    );
});
