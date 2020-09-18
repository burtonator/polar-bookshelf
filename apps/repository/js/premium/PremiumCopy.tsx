import {UserInfo} from "../../../../web/js/apps/repository/auth_handler/AuthHandler";
import {
    CancelSubscriptionButton,
    FreePlan,
    PlanInterval,
    PlusPlan,
    PricingOverview,
    ProPlan,
} from "./PremiumContent";
import {PremiumButton} from "./PremiumButton";
import React from "react";
<<<<<<< HEAD:apps/repository/js/splash/splashes/premium/PremiumCopy.tsx
import {NullCollapse} from "../../../../../../web/js/ui/null_collapse/NullCollapse";
import {Billing} from "polar-accounts/src/Billing";
import Paper from "@material-ui/core/Paper";
=======
import {Billing} from "polar-accounts/src/Billing";
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {CancelPlan} from "./CancelPlan";
import {PlanIntervalButton} from "./PlanIntervalButton";
import { FindPlan } from "./FindPlan";
>>>>>>> 373f4a844cb6f5f4fb4e0d18c58b58729b9cb9b5:apps/repository/js/premium/PremiumCopy.tsx

export const MobileContent = () => {

    return <div id="pricing" className="mt-1 pb-1">
        <FindPlan/>

        <div className="mb-1">
            <PlanIntervalButton/>
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

            <PlusPlan/>

            <p className="font-weight-bold">
                Adds the following features:
            </p>

            <div className="ml-3 mt-1 mb-2">
                <div><i className="fa fa-check"/> Three (4) cloud sync devices </div>
                <div><i className="fa fa-check"/> Up to 5GB of storage </div>
            </div>

            <PremiumButton newPlan="plus" />

        </div>

        <div className="mt-3">
            <hr/>

            <ProPlan/>

            <p className="font-weight-bold">
                Adds the following features:
            </p>

            <div className="ml-3 mt-1 mb-2">
                <div><i className="fa fa-check"/> Unlimited cloud sync devices </div>
                <div><i className="fa fa-check"/> Up to 12GB of storage </div>
            </div>

            <PremiumButton newPlan="pro" />

        </div>

        <div className="ml-auto">
            <CancelPlan/>
        </div>

    </div>;
};

export const DesktopContent =  () => {

    const {plan} = useUserSubscriptionContext();

    return (
        <div className={"plan-" + plan} >

            <div id="pricing" className="hidden-xs m-2">

                <PricingOverview/>

                    <table className="table">
                        <thead>
                        <tr>
                            <th>
                                <FindPlan/>

                                <p className="text-center">
                                    <PlanIntervalButton />
                                </p>

                            </th>
                            <th className="">
                                <FreePlan/>
                            </th>
                            <th className="">
                                <PlusPlan />
                            </th>
                            <th className="">
                                <ProPlan />
                            </th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr className="buy-links">
                            <td>
                            </td>
                            <td>
                            </td>
                            <td>
                                <PremiumButton newPlan="plus" />
                            </td>
                            <td className="">
                                <PremiumButton newPlan="pro" />
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
                        </tr>

                        </tbody>
                    </table>

                <div className="m-2"
                     style={{display: 'flex'}}>

                    <div className="ml-auto">
                        <CancelSubscriptionButton/>
                    </div>

                </div>

            </div>

        </div>
    );

};


export interface IProps {
    readonly plan: Billing.Plan;
    readonly userInfo?: UserInfo;
    readonly interval: PlanInterval;
    readonly togglePlanInterval: () => void;
}

