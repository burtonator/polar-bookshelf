/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {NullCollapse} from '../../../../web/js/ui/null_collapse/NullCollapse';
import {Billing} from "polar-accounts/src/Billing";
import {MachineIDs} from "polar-shared/src/util/MachineIDs";
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

export function SupportContent() {

    /* WARN: taken directly from polar-site */

    const userInfoContext = useUserInfoContext();

    const plan = userInfoContext?.userInfo?.subscription.plan || 'free'

    return (
        <div className="container">

            <div className="row" id="support">

                <div className="col">
                    <div className="mb-3">
                        <h1>Support Plans</h1>
                    </div>

                    <NullCollapse open={plan === 'free'}>

                        <p className="text-xl">
                            Polar has two main support options. Premium and
                            Community.
                        </p>

                        <h2>Premium</h2>

                        <p className="text-lg">
                            All users of <a href="#plans">Polar
                            Premium</a> benefit
                            from direct support with 24 hour response
                            time. This includes the <b>bronze</b>,
                            <b>silver</b>, and <b>gold</b> plans.
                        </p>

                        <p className="text-lg">
                            Additionally, bug fixes and feature requests from
                            premium users carry greater priority in our
                            milestone
                            planning.
                        </p>

                        <h2>Community</h2>

                        <p className="text-lg">
                            Users on the free tier can use our community
                            resources
                            and reach out on <a
                            href="https://discord.gg/GT8MhA6">Discord</a> or <a
                            href="https://github.com/burtonator/polar-bookshelf/issues">Create
                            an issue on Github</a>.
                        </p>

                        <p className="text-lg">
                            We try our best to address your issues but obviously
                            we focus on premium users first. Premium also means
                            you take advantage of all the other features
                            included
                            there including cloud sync.
                        </p>

                    </NullCollapse>

                    <NullCollapse open={plan !== 'free'}>

                        <p className="text-lg">
                            As a premium user on the <b>{plan}</b> you
                            quality for premium support.
                        </p>

                        <p className="text-lg">
                            You can contact support directly at:
                        </p>

                        <h3>
                            <b>support+{MachineIDs.get().substring(0, 5)}@getpolarized.io</b>
                        </h3>

                    </NullCollapse>

                </div>

            </div>

        </div>
    );
}


