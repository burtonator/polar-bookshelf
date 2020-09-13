/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {LoginButton} from './LoginButton';
import {AccountControlDropdown} from './AccountControlDropdown';
import {AccountActions} from "../../accounts/AccountActions";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";

export const AccountAuthButton = React.memo(() => {

    const userInfoContext = useUserInfoContext();

    if (! userInfoContext) {
        // we don't currently know our login state
        return null;
    }

    function enableCloudSync() {
        AccountActions.login();
    }

    if (! userInfoContext.userInfo) {
        return <LoginButton onClick={() => enableCloudSync()}/>;
    }

    return <AccountControlDropdown userInfo={userInfoContext?.userInfo}/>;

});
