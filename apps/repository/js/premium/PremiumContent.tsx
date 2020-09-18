/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountActions} from '../../../../web/js/accounts/AccountActions';
import {Numbers} from "polar-shared/src/util/Numbers";
import {DesktopContent, MobileContent} from "./PremiumCopy";
import {Discount, Discounts} from "./Discounts";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {Billing} from "polar-accounts/src/Billing";
import Button from '@material-ui/core/Button';
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {Plans} from "polar-accounts/src/Plans";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import { usePremiumCallbacks, usePremiumStore } from './PremiumStore';
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {PlanPricing} from "./PlanPricing";

const discounts = Discounts.create();

function useCancelSubscription() {

    const log = useLogger();
    const dialogManager = useDialogManager();

    return () => {

        const onAccept = () => {

            dialogManager.snackbar({message: "Canceling plan.  One moment..."});

            AccountActions.cancelSubscription()
                .catch(err => log.error("Unable to cancel plan: ", err));

        };

        dialogManager.confirm({
            title: `Are you sure you want to cancel your plan and revert to the free tier?`,
            subtitle: 'Your billing will automatically be updated and account pro-rated.',
            onAccept
        });

    }

}

export const CancelSubscriptionButton = deepMemo(() => {

    const {plan} = useUserSubscriptionContext();
    const handleCancelSubscription = useCancelSubscription();

    if (plan.level === 'free') {
        return null;
    }

    return (
        <Button size="large"
                variant="contained"
                onClick={handleCancelSubscription}>

            Cancel Subscription

        </Button>
    );

});


export const PricingOverview = deepMemo(() => {
    return (
        <div>
            <div className="text-center mb-3">
                <h1>Pricing and Plans</h1>
            </div>

            <p className="text-center mb-3 text-xlarge">
                Polar is designed to scale to from both novice users to
                Power users.

                Just need to read a few PDFs. No problem. Need to manage
                and read hundreds to thousands of documents? No problem.
            </p>

            <p className="text-center mb-3 text-xlarge">
                Have an issue?  Feel free to send us an email at <b>support@getpolarized.io</b>
            </p>
        </div>
    );
});

export const FreePlan = deepMemo(() => {
    return <div>
        <h2>FREE</h2>

        <h3 className="text-xxlarge">$0</h3>
        <p className="text-small text-tint">
            We want as many people to use Polar as
            possible. Most people
            easily stay within these limits.
        </p>

    </div>;
});

export const PlusPlan = deepMemo((props: IState) => {

    return <div>
        <h2>PLUS</h2>

        <PlanPricing plan='plus'/>

        <p className="text-small text-tint">Less
            than the price of a cup of
            coffee. Need more storage and ready to
            move up to the next level? We're ready
            when you are!</p>

    </div>;

});

export const ProPlan = deepMemo(() => {
    return <div>
        <h2>PRO</h2>

        <PlanPricing plan='pro'/>

        <p className="text-small text-tint">
            You can't live without Polar
            and have a massive amount of data that
            you need to keep secure.
        </p>
        <br/>
    </div>;
});


export const PremiumContent = deepMemo(() => {

    const phoneOrTablet = (
        <MobileContent/>
    );

    const desktop = (
        <DesktopContent/>
    );

    return (
        <DeviceRouter phone={phoneOrTablet} tablet={phoneOrTablet} desktop={desktop}/>
    );

});

interface IProps {
}

interface IState {
}

export type PlanInterval = 'month' | 'year';

