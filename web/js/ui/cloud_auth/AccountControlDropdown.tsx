/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../apps/repository/auth_handler/AuthHandler';
import {AccountControl} from './AccountControl';
import {MUIPopper} from "../../mui/menu/MUIPopper";
import {AccountAvatar} from './AccountAvatar';
import {deepMemo} from "../../react/ReactUtils";


interface IProps {
    readonly userInfo: UserInfo;
}

export const AccountControlDropdown = deepMemo((props: IProps) => (

    <MUIPopper id="account-control-button"
               icon={<AccountAvatar size="small"/>}
               placement="bottom-end"
               caret>

        <AccountControl userInfo={props.userInfo}/>

    </MUIPopper>

));
