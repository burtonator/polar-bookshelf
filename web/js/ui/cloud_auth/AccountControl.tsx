/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountOverview} from "../../../../apps/repository/js/account_overview/AccountOverview";
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";
import {EmailStr, URLStr} from "polar-shared/src/util/Strings";
import {Billing} from "polar-accounts/src/Billing";
import {MUIRouterLink} from "../../mui/MUIRouterLink";
import {AccountAvatar} from "./AccountAvatar";
import {memoForwardRefDiv} from "../../react/ReactUtils";
import {useLogoutCallback} from "../../accounts/AccountHooks";
import {Callback} from "polar-shared/src/util/Functions";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";
import Subscription = Billing.Subscription;
import {usePopperController} from "../../mui/menu/MUIPopper";

interface LogoutButtonProps {
    readonly onLogout: Callback;
}

const LogoutButton = (props: LogoutButtonProps) => {

    return <Button id="cloud-sync-logout"
                   color="secondary"
                   onClick={() => props.onLogout()}>

        Logout

    </Button>;

};
//
// const InviteUsersButton = () => {
//
//     return <Link to={{pathname: '/invite'}}>
//         <Button id="cloud-sync-invite-users"
//                 color="secondary"
//                 outline
//                 size="md">
//
//             <i className="fas fa-user-plus mr-1"/>
//
//             Invite Users
//
//         </Button>
//     </Link>;
//
// };

const ViewPlansAndPricingButton = () => {

    const popperController = usePopperController();

    const handler = () => {
        Analytics.event({category: 'premium', action: 'view-plans-and-pricing-button'});
        popperController.dismiss();
    };

    return (
        <MUIRouterLink to='/plans'>
            <Button color="secondary"
                    variant="contained"
                    size="large"
                    onClick={handler}>

                <i className="fas fa-certificate"/>
                &nbsp;
                View Plans and Pricing

            </Button>
        </MUIRouterLink>
    );
};


interface IBasicUserInfo {
    readonly photoURL?: URLStr;
    readonly displayName?: string | undefined;
    readonly email?: EmailStr;
    readonly subscription: Subscription;
}

interface IProps {

    readonly userInfo: IBasicUserInfo;

}

function useLogoutAction(): Callback {

    const dialogs = useDialogManager();

    const logoutCallback = useLogoutCallback();

    return () => {

        dialogs.confirm({
            type: 'danger',
            title: "Are you sure you want to logout?",
            subtitle: "Just wanted to double check. Are you sure you want to logout?",
            onAccept: logoutCallback
        });

    }

}

export const AccountControl = memoForwardRefDiv((props: IProps, ref) => {

    const logoutAction = useLogoutAction();
    const popperController = usePopperController();

    function handleLogout() {
        popperController.dismiss();
        logoutAction();
    }

    return (

        <div style={{padding: '10px 20px'}} ref={ref}>

            <div>
                <div className="text-center">

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AccountAvatar size="large" style={{width: '100px', height: '100px'}}/>
                    </div>

                    <div className="p-1">

                        <div className="text-lg"
                             style={{fontWeight: 'bold'}}>

                            {props.userInfo.displayName || 'Anonymous'}

                        </div>

                        <div className="text-muted text-md"
                             style={{}}>
                            {props.userInfo.email || ''}
                        </div>


                    </div>


                </div>

                <div className="mt-2 pt-2 pb-2 border-top text-center">

                    <div className="mt-2 mb-3">
                        <AccountOverview
                            plan={props.userInfo.subscription.plan}/>
                    </div>

                    <ViewPlansAndPricingButton/>

                </div>

                <div className="mt-2 pt-2 pb-2 border-top text-right">

                    <div style={{display: 'flex', whiteSpace: 'nowrap'}}
                         className="mt-2">

                        <div className="ml-auto mr-1">
                            {/*<InviteUsersButton/>*/}
                        </div>

                        <div>
                            <LogoutButton onLogout={handleLogout}/>
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

});
