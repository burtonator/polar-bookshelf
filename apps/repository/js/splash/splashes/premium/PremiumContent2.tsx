/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {Numbers} from "polar-shared/src/util/Numbers";
import {DesktopContent, MobileContent} from "./PremiumCopy";
import {Discount, Discounts} from "./Discounts";
import {DeviceRouter} from "../../../../../../web/js/ui/DeviceRouter";
import {Billing} from "polar-accounts/src/Billing";
import Button from '@material-ui/core/Button';
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLogger} from "../../../../../../web/js/mui/MUILogger";
import {Plans} from "polar-accounts/src/Plans";

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

export const CancelSubscriptionButton = (props: IProps) => {

    const handleCancelSubscription = useCancelSubscription();

    if (props.plan === 'free') {
        return null;
    }

    return (
        <Button color="primary"
                size="large"
                variant="contained"
                onClick={handleCancelSubscription}>

            Cancel Subscription

        </Button>
    );

};

interface PlanIntervalProps {
    readonly interval: PlanInterval;
    readonly togglePlanInterval: () => void;
}

export const PlanIntervalButton = (props: PlanIntervalProps) => {

    return <Button color="secondary"
                   variant="contained"
                   onClick={() => props.togglePlanInterval()}>

            Show {props.interval === 'month' ? 'Yearly' : 'Monthly'} Plans

        </Button>;

};


interface PlanPricingProps {
    readonly plan: Billing.Plan;
    readonly planInterval: Billing.Interval;
}
const PlanPricing = (props: PlanPricingProps) => {

    const computeMonthlyPrice = () => {

        const v2Plan = Plans.toV2(props.plan)

        switch (v2Plan.level) {

            case "free":
                return 0.0;
            case "plus":
                return 6.99;
            case "pro":
                return 14.99;
        }

    };

    const computeYearlyPrice = () => {
        const monthlyAmount = computeMonthlyPrice();
        return Numbers.toFixedFloat(monthlyAmount * 11, 2);
    };

    interface Pricing {
        readonly price: number;
        readonly discount: Discount | undefined;
    }

    const computePrice = (): Pricing => {

        const price = props.planInterval === 'month' ? computeMonthlyPrice() : computeYearlyPrice();
        const discount = discounts.get(props.planInterval, props.plan);

        return {price, discount};
    };

    const pricing = computePrice();

    if (pricing.discount) {

        return <div>

            <s>
                <h3 className="text-xxlarge">${pricing.discount.before}<span
                    className="text-small">/{props.planInterval}</span>
                </h3>
            </s>

            <h3 className="text-xxlarge">
                    ${pricing.discount.after}<span
                className="text-small">/{props.planInterval}</span>
            </h3>

        </div>;

    } else {

        return <div>
            <h3 className="text-xxlarge">${pricing.price}<span
                className="text-small">/{props.planInterval}</span>
            </h3>

        </div>;

    }

};


export const PricingOverview = () => {
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
};

export const FindPlan = () => {

    return <div>
        <h2 className="text-tint text-left">

            Find a plan<br/>

            {/*<span className="text-large">that's right for you.</span>*/}

        </h2>


        <p>
            We have both yearly and monthly plans.  Get a free
            month of service if you buy for a whole year!
        </p>
    </div>;

};

export const FreePlan = () => {
    return <div>
        <h2>Free</h2>

        <h3 className="text-xxlarge">$0</h3>
        <p className="text-small text-tint">
            We want as many people to use Polar as
            possible. Most people
            easily stay within these limits.
        </p>

    </div>;
};

export const BronzePlan = (props: IState) => {
    return <div>
        <h2>Bronze</h2>

        <PlanPricing plan='bronze' planInterval={props.interval}/>

        <p className="text-small text-tint">Less
            than the price of a cup of
            coffee. Need more storage and ready to
            move up to the next level? We're ready
            when you are!</p>

    </div>;
};

export const SilverPlan = (props: IState) => {
    return <div>
        <h2>Silver</h2>

        <PlanPricing plan='silver' planInterval={props.interval}/>

        <p className="text-small text-tint">
            Designed for Polar power users! Need
            more storage? Let's do this!
        </p>
    </div>;
};

export const GoldPlan = (props: IState) => {
    return <div>
        <h2>Gold</h2>

        <PlanPricing plan='gold' planInterval={props.interval}/>

        <p className="text-small text-tint">
            You can't live without Polar
            and have a massive amount of data that
            you need to keep secure.
        </p>
        <br/>
    </div>;
};


export class PremiumContent2 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.togglePlanInterval = this.togglePlanInterval.bind(this);

        this.state = {
            interval: this.props.interval || 'month'
        };

    }

    public render() {

        const phoneOrTablet = (
            <MobileContent {...this.props}
                           {...this.state}
                           togglePlanInterval={() => this.togglePlanInterval()}/>
        );

        const desktop = (
            <DesktopContent {...this.props}
                            {...this.state}
                            togglePlanInterval={() => this.togglePlanInterval()}/>
        );

        return (
            <DeviceRouter phone={phoneOrTablet} tablet={phoneOrTablet} desktop={desktop}/>
        );

    }

    private togglePlanInterval() {

        this.setState({
            interval: this.state.interval === 'month' ? 'year' : 'month'
        });

    }

}

interface IProps {
    readonly plan: Billing.Plan;
    readonly interval?: Billing.Interval;

}

interface IState {
    readonly interval: PlanInterval;
}

export type PlanInterval = 'month' | 'year';
