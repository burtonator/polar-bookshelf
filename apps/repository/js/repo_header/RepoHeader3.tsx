import * as React from 'react';
import {NavIcon} from "../nav/NavIcon";
import {Link} from "react-router-dom";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {createTeleporter} from "react-teleporter";
import {RepoNavbar} from "../RepoNavbar";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import {AccountAuthButton} from "../../../../web/js/ui/cloud_auth/AccountAuthButton";
import {CloudConnectivityButton} from "../../../../web/js/apps/repository/connectivity/CloudConnectivityButton";
import {MoreActionsDropdown} from "./MoreActionsDropdown";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {ChromeExtensionInstallButton} from "../ChromeExtensionInstallButton";

export namespace RepoHeader {

    export const leftMenuTeleporter = createTeleporter();
    export const LeftMenuTarget = leftMenuTeleporter.Target;
    export const LeftMenu = leftMenuTeleporter.Source;

    export const rightTeleporter = createTeleporter();
    export const RightTarget = rightTeleporter.Target;
    export const Right = rightTeleporter.Source;

    export const leftTeleporter = createTeleporter();
    export const LeftTarget = rightTeleporter.Target;
    export const Left = rightTeleporter.Source;

}

const Handheld = () => {

    return (

        <MUIPaperToolbar borderBottom
                         padding={1}>

            <div style={{display: 'flex'}}>

                <div className="mr-1"
                     style={{
                         flexGrow: 1,
                         display: 'flex',
                         alignItems: 'center',
                         flexWrap: 'nowrap',
                     }}>

                    <RepoHeader.LeftMenuTarget/>

                    <div className="">
                        <NavIcon/>
                    </div>

                    <RepoHeader.LeftTarget/>

                </div>

                <div className="mt-auto mb-auto"
                     style={{
                         display: 'flex'
                     }}>

                    <RepoHeader.RightTarget/>

                    <Link to={{hash: 'account'}}>
                        {/*<Button size="md" color="clear" className="btn-no-outline">*/}
                        {/*    <i className="fas fa-user"/>*/}
                        {/*</Button>*/}
                    </Link>

                    {/*<CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />*/}

                </div>

            </div>
        </MUIPaperToolbar>
    );

}

const Desktop = () => {

    const SettingsButton = React.memo(() => {

        return (
            <Link to="/settings">
                <IconButton>
                    <SettingsIcon
                        // size="md"
                        //         className="border ml-1 text-muted"
                        //             color="clear"
                    >
                    </SettingsIcon>
                </IconButton>
            </Link>
        );

    });

    return (

        <MUIPaperToolbar borderBottom
                         padding={1}>

            <div className=""
                 style={{
                     display: 'flex',
                     flexWrap: 'nowrap',
                 }}>

                <div>
                    <RepoNavbar/>
                </div>

                <div style={{
                         flexGrow: 1,
                         display: 'flex',
                         justifyContent: 'flex-end',
                         flexWrap: 'nowrap',
                     }}>

                    <MUIButtonBar>

                        <ChromeExtensionInstallButton/>

                        <CloudConnectivityButton/>

                        <AccountAuthButton/>

                        <SettingsButton/>

                        <MoreActionsDropdown/>

                    </MUIButtonBar>

                </div>

            </div>

        </MUIPaperToolbar>


    );
}

/**
 * Simple header for the repository which supports arbitrary children.
 */
export const RepoHeader3 = React.memo(() => {
    return <DeviceRouter handheld={<Handheld />} desktop={<Desktop/>}/>;
})
