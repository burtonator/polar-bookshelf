import {UserInfo} from "../../../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {
    BronzePlan, CancelSubscriptionButton,
    FindPlan,
    FreePlan,
    GoldPlan,
    PlanInterval,
    PlanIntervalButton,
    PricingOverview,
    SilverPlan
} from "./PremiumContent2";
import {PremiumButton} from "./PremiumButton";
import React from "react";
import {NullCollapse} from "../../../../../../web/js/ui/null_collapse/NullCollapse";
import {Billing} from "polar-accounts/src/Billing";
import Paper from "@material-ui/core/Paper";

export const MobileContent = (props: IProps) => {
    return <div id="pricing" className="mt-1 mb-1">
        <FindPlan/>

        <div className="mb-1">
            <PlanIntervalButton interval={props.interval}
                                togglePlanInterval={() => props.togglePlanInterval()}/>
        </div>

        <div>

            <hr/>

            <FreePlan/>

            <p className="font-weight-bold">
                Basic plan includes:
            </p>

            <ul>
                <li>Flashcard review for desktop only</li>
                <li>Two (2) cloud sync devices</li>
                <li>350MB of cloud storage</li>
                <li>up to 100 captured web documents</li>
            </ul>

        </div>

        <div className="mt-3">

            <hr/>

            <BronzePlan {...props}/>

            <p className="font-weight-bold">
                Adds the following features:
            </p>

            <div className="ml-3 mt-1 mb-2">
                <div><i className="fa fa-check"/> Flashcard review on mobile, desktop, and web. </div>
                <div><i className="fa fa-check"/> Suggestions for related tags</div>
                <div><i className="fa fa-check"/> Reading statistics</div>
                <div><i className="fa fa-check"/> Three (3) cloud sync devices </div>
                <div><i className="fa fa-check"/> Up to 2GB of storage </div>
            </div>

            <PremiumButton from={props.plan} to="bronze" userInfo={props.userInfo} interval={props.interval}/>

        </div>

        <div className="mt-3">

            <hr/>

            <SilverPlan {...props}/>

            <p className="font-weight-bold">
                Adds the following features:
            </p>

            <div className="ml-3 mt-1 mb-2">
                <div><i className="fa fa-check"/> Three (4) cloud sync devices </div>
                <div><i className="fa fa-check"/> Up to 5GB of storage </div>
            </div>

            <PremiumButton from={props.plan} to="silver" userInfo={props.userInfo} interval={props.interval}/>

        </div>

        <div className="mt-3">
            <hr/>

            <GoldPlan {...props}/>

            <p className="font-weight-bold">
                Adds the following features:
            </p>

            <div className="ml-3 mt-1 mb-2">
                <div><i className="fa fa-check"/> Unlimited cloud sync devices </div>
                <div><i className="fa fa-check"/> Up to 12GB of storage </div>
            </div>

            <PremiumButton from={props.plan} to="gold" userInfo={props.userInfo} interval={props.interval}/>

        </div>

        <div className="ml-auto">

            <NullCollapse open={props.plan !== 'free'}>
                <hr/>
                <p>
                    ... and of course in the ultra-rare case that Polar didn't work out you can always cancel at any time.
                </p>

                <CancelSubscriptionButton {...props}/>
            </NullCollapse>
        </div>

    </div>;
};

export const DesktopContent =  (props: IProps) => {
    return (
        <Paper className={"plan-" + props.plan}>

            <Paper id="pricing" className="hidden-xs">

                <PricingOverview/>

                <Paper>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>
                                <FindPlan/>

                                <p className="text-center">

                                    <PlanIntervalButton interval={props.interval}
                                                        togglePlanInterval={() => props.togglePlanInterval()}/>

                                </p>

                            </th>
                            <th className="">
                                <FreePlan/>
                            </th>
                            <th className="">
                                <BronzePlan {...props}/>
                            </th>
                            <th className="">
                                <SilverPlan {...props}/>
                            </th>
                            <th className="">
                                <GoldPlan {...props}/>
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr className="buy-links">
                            <td>
                            </td>
                            <td>
                            </td>
                            <td className="">
                                <PremiumButton from={props.plan} to="bronze" userInfo={props.userInfo} interval={props.interval}/>
                            </td>
                            <td>
                                <PremiumButton from={props.plan} to="silver" userInfo={props.userInfo} interval={props.interval}/>
                            </td>
                            <td className="">
                                <PremiumButton from={props.plan} to="gold" userInfo={props.userInfo} interval={props.interval}/>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Automatic Updates
                            </td>

                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Web + Desktop
                            </td>

                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Flashcards and Incremental Reading with Spaced Repetition
                            </td>

                            <td className="text-danger">
                                desktop only
                            </td>
                            <td>
                                mobile, web, and desktop
                            </td>
                            <td>
                                mobile, web, and desktop
                            </td>
                            <td>
                                mobile, web, and desktop
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Feature/roadmap votes and priority
                            </td>

                            <td className="text-danger">
                                1
                            </td>
                            <td>
                                2
                            </td>
                            <td>
                                3
                            </td>
                            <td>
                                4
                            </td>
                        </tr>

                        <tr>
                            <td>
                                Number of active cloud sync devices
                            </td>

                            <td className="">
                                2
                            </td>
                            <td className="">
                                3
                            </td>
                            <td className="">
                                4
                            </td>
                            <td className="">
                                unlimited
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Cloud storage
                            </td>

                            <td className="">
                                Up to 350MB
                            </td>
                            <td className="">
                                Up to 2GB
                            </td>
                            <td className="">
                                Up to 5GB
                            </td>
                            <td className="">
                                Up to 12GB
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Max Captured Web Documents
                            </td>

                            <td className="">
                                Up to 100
                            </td>
                            <td className="">
                                Up to 500
                            </td>
                            <td className="">
                                Up to 1500
                            </td>
                            <td className="">
                                unlimited
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Related tag suggestions
                            </td>

                            <td className="">
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Reading statistics
                            </td>

                            <td className="">
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Support
                            </td>

                            <td className="">
                                <span className="feature-na">---</span>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                            <td className="">
                                <i className="fa fa-check"/>
                            </td>
                        </tr>

                        </tbody>
                    </table>

                </Paper>

                <div className="mt-2"
                     style={{display: 'flex'}}>

                    <div className="ml-auto">
                        <CancelSubscriptionButton {...props}/>
                    </div>

                </div>

            </Paper>

        </Paper>
    );

};


export interface IProps {
    readonly plan: Billing.Plan;
    readonly userInfo?: UserInfo;
    readonly interval: PlanInterval;
    readonly togglePlanInterval: () => void;
}

