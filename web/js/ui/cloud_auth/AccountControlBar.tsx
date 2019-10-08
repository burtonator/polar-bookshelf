/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {UserInfo} from '../../../../web/js/apps/repository/auth_handler/AuthHandler';
import Button from 'reactstrap/lib/Button';
import {RendererAnalytics} from '../../ga/RendererAnalytics';

const LogoutButton = (props: IProps) => {

    return <Button id="cloud-sync-logout"
                   color="secondary"
                   outline
                   size="sm"
                   onClick={() => props.onLogout()}
                   className="ml-1">

        <i className="fas fa-sign-out-alt mr-1"></i>

        Logout

    </Button>;

};

const UserImage = (props: IProps) => {

    if (props.userInfo.photoURL) {

        return <div style={{height: '100px', width: '100px'}}>

            <img className="rounded border m-auto"
                 style={{
                     maxHeight: '100px',
                     maxWidth: '100px'
                 }}
                 src={props.userInfo.photoURL}/>
        </div>;
    } else {
        return <div/>;
    }

};

const InviteUsersButton = (props: IProps) => {

    return <Button id="cloud-sync-invite-users"
                   color="secondary"
                   size="sm"
                   onClick={() => props.onInvite()}>

        <i className="fas fa-user-plus mr-1"></i>

        Invite Users

    </Button>;

};

const ViewPlansAndPricingButton = () => {

    const handler = () => {

        RendererAnalytics.event({category: 'premium', action: 'view-plans-and-pricing-button'});

        document.location.hash = "plans";

    };

    return <Button color="success"
                   size="md"
                   onClick={handler}>

        <i className="fas fa-certificate"></i>
        &nbsp;
        View Plans and Pricing

    </Button>;
};

export class AccountControlBar extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {



        const props = this.props;

        return (

            <div>

                <div>
                    <div style={{
                        display: 'flex',
                        verticalAlign: 'top'
                    }}>

                        <div className="pl-0 p-0 pr-2">

                            <UserImage {...props}/>

                        </div>

                        <div className="p-1">

                            <div style={{fontWeight: 'bold'}}>
                                {this.props.userInfo.displayName || 'Anonymous'}
                            </div>

                            <div className="text-muted" style={{fontSize: "14px"}}>
                                {this.props.userInfo.email || ''}
                            </div>

                            <div style={{display: 'block', whiteSpace: 'nowrap'}} className="mt-2">

                                <InviteUsersButton {...props}/>

                                <LogoutButton {...props}/>

                            </div>

                        </div>


                    </div>

                    <div className="mt-2 pt-2 border-top text-center">

                        <ViewPlansAndPricingButton/>

                    </div>

                </div>

            </div>

        );

    }

}

interface IProps {

    readonly userInfo: UserInfo;

    readonly onInvite: () => void;

    readonly onLogout: () => void;

}

interface IState {
}
