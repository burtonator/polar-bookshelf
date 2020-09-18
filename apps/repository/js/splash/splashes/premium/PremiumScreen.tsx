import * as React from 'react';
import {FixedNav, FixedNavBody} from '../../../FixedNav';
import {PremiumContent2} from './PremiumContent2';
import {RepoFooter} from "../../../repo_footer/RepoFooter";
import {Billing} from "polar-accounts/src/Billing";
import {useUserInfoContext} from "../../../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

export interface IProps {
    readonly interval?: Billing.Interval;
}

export const PremiumScreen = (props: IProps) => {

    const userInfoContext = useUserInfoContext();

    const plan = userInfoContext?.userInfo?.subscription.plan || 'free'

    return (

        <FixedNav id="doc-repository">

            <FixedNavBody className="container-fluid">

                <div className="row">

                    <div className="col-lg-12 w-100 pt-4">
                        <PremiumContent2 interval={props.interval} plan={plan}/>
                    </div>
                </div>

            </FixedNavBody>

            <RepoFooter/>

        </FixedNav>

    );
};
