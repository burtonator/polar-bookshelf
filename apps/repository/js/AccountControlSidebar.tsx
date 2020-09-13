import React from 'react';
import {RightSidebar} from "../../../web/js/ui/motion/RightSidebar";
import {AccountControl} from "../../../web/js/ui/cloud_auth/AccountControl";
import {DeviceRouter} from "../../../web/js/ui/DeviceRouter";
import {PersistenceLayerController} from "../../../web/js/datastore/PersistenceLayerManager";
import {useUserInfoContext} from "../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {deepMemo} from "../../../web/js/react/ReactUtils";

interface AccountInfoProps extends AccountControlSidebarProps {
    readonly persistenceLayerController: PersistenceLayerController;
}

const AccountInfo = (props: AccountInfoProps) => {

    const userInfoContext = useUserInfoContext();

    if (userInfoContext?.userInfo) {
        return <AccountControl {...props}
                               userInfo={userInfoContext?.userInfo}/>;
    } else {
        return <h2>Please Login</h2>;
    }

};

interface AccountControlSidebarProps {
    readonly persistenceLayerController: PersistenceLayerController;
}

const AccountDataLoader = (props: AccountControlSidebarProps) => (
    <div className="p-2">
        <AccountInfo {...props}/>
    </div>
);

namespace devices {

    const onClose = () => window.history.back();

    export const Phone = (props: AccountControlSidebarProps) => (
        <RightSidebar onClose={() => onClose()} fullscreen={true}>
            <AccountDataLoader {...props}/>
        </RightSidebar>
    );

    export const TabletAndDesktop = (props: AccountControlSidebarProps) => (
        <RightSidebar onClose={() => onClose()}>
            <AccountDataLoader {...props}/>
        </RightSidebar>
    );

}

export const AccountControlSidebar = deepMemo((props: AccountControlSidebarProps) => (

    <DeviceRouter phone={<devices.Phone {...props}/>}
                  tablet={<devices.TabletAndDesktop {...props}/>}
                  desktop={<devices.TabletAndDesktop {...props}/>}/>

));

