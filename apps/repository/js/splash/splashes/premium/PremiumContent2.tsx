/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {PremiumButton} from './PremiumButton';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountPlan} from '../../../../../../web/js/accounts/Account';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';
import Button from 'reactstrap/lib/Button';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {Dialogs} from '../../../../../../web/js/ui/dialogs/Dialogs';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../../../../../../web/js/ui/toaster/Toaster';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Numbers} from "polar-shared/src/util/Numbers";

const log = Logger.create();

function cancelSubscription() {

    const onConfirm = () => {
        Toaster.info("Canceling plan.  One moment...");

        AccountActions.cancelSubscription()
            .catch(err => log.error("Unable to cancel plan: ", err));
    };

    Dialogs.confirm({
        title: `Are you sure you want to cancel your plan and revert to the free tier?`,
        subtitle: 'Your billing will automatically be updated and account pro-rated.',
        onConfirm
    });

}

const CancelSubscriptionButton = (props: IProps) => {

    return <NullCollapse open={props.plan !== 'free'}>

        <Button color="secondary"
                size="sm"
                onClick={() => cancelSubscription()}>

            Cancel Subscription

        </Button>

    </NullCollapse>;
};

interface PlanIntervalProps {
    readonly planInterval: PlanInterval;
    readonly togglePlanInterval: () => void;
}
const PlanIntervalButton = (props: PlanIntervalProps) => {

    return <Button color="secondary"
                   size="sm"
                   onClick={() => props.togglePlanInterval()}>

            Show {props.planInterval === 'month' ? 'Monthly' : 'Yearly'} Plans

        </Button>;

};


interface PlanPricingProps {
    readonly plan: AccountPlan;
    readonly planInterval: PlanInterval;
}
const PlanPricing = (props: PlanPricingProps) => {

    const computeMonthlyAmount = () => {

        switch (props.plan) {

            case "free":
                return 0.0;
            case "bronze":
                return 4.99;
            case "silver":
                return 9.99;
            case "gold":
                return 14.99;
        }

    };


    const computeYearlyAmount = () => {
        const monthlyAmount = computeMonthlyAmount();
        return Numbers.toFixedFloat(monthlyAmount * 11, 2);
    };

    const amount = props.planInterval === 'month' ? computeMonthlyAmount() : computeYearlyAmount();

    return <div>
        <h3 className="text-xxlarge">${amount}<span
            className="text-small">/{props.planInterval}</span>
        </h3>

    </div>;

};


export class PremiumContent2 extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.togglePlanInterval = this.togglePlanInterval.bind(this);

        this.state = {
            planInterval: 'month'
        };

    }

    public render() {

        /* WARN: taken directly from polar-site */

        return (
            <div className={"plan-" + this.props.plan}>

                <div id="pricing" className="hidden-xs">

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

                    <div className="white-box high-shadow table-box">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>
                                    <h2 className="text-tint text-left">

                                    Find a plan<br/>

                                    {/*<span className="text-large">that's right for you.</span>*/}

                                    </h2>


                                    <p>
                                        We have both yearly and monthly plans.  Get a free
                                        month of service if you buy for a whole year!
                                    </p>

                                    <p className="text-center">

                                        <PlanIntervalButton planInterval={this.state.planInterval}
                                                            togglePlanInterval={() => this.togglePlanInterval()}/>

                                    </p>

                                </th>
                                <th className="">
                                    <p className="text-xlarge ">Free</p>

                                    <h3 className="text-xxlarge">$0</h3>
                                    <p className="text-small text-tint">
                                        We want as many people to use Polar as
                                        possible. Most people
                                        easily stay within these limits.
                                    </p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge  highlight">Bronze</p>

                                    <PlanPricing plan='bronze' planInterval={this.state.planInterval}/>

                                    <p className="text-small text-tint">Less
                                        than the price of a cup of
                                        coffee. Need more storage and ready to
                                        move up to the next level? We're ready
                                        when you are!</p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge ">Silver</p>

                                    <PlanPricing plan='silver' planInterval={this.state.planInterval}/>

                                    <p className="text-small text-tint">
                                        Designed for Polar power users! Need
                                        more storage? Let's do this!
                                    </p>
                                    <br/>
                                </th>
                                <th className="">
                                    <p className="text-xlarge ">Gold</p>

                                    <PlanPricing plan='gold' planInterval={this.state.planInterval}/>

                                    <p className="text-small text-tint">
                                        You can't live without Polar
                                        and have a massive amount of data that
                                        you need to keep secure.
                                    </p>
                                    <br/>
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
                                    <PremiumButton from={this.props.plan} to="bronze" userInfo={this.props.userInfo} interval={this.state.planInterval}/>
                                </td>
                                <td>
                                    <PremiumButton from={this.props.plan} to="silver" userInfo={this.props.userInfo} interval={this.state.planInterval}/>
                                </td>
                                <td className="">
                                    <PremiumButton from={this.props.plan} to="gold" userInfo={this.props.userInfo} interval={this.state.planInterval}/>
                                </td>
                            </tr>


                            <tr>
                                <td>
                                    Automatic Updates
                                </td>

                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Web + Desktop
                                </td>

                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
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
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Reading statistics
                                </td>

                                <td className="">
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
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
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                                <td className="">
                                    <i className="fa fa-check"></i>
                                </td>
                            </tr>

                            </tbody>
                        </table>

                    </div>

                    <div className="mt-2"
                         style={{display: 'flex'}}>

                        <div className="ml-auto">
                            <CancelSubscriptionButton {...this.props}/>
                        </div>

                    </div>

                </div>


            </div>
        );
    }

    private togglePlanInterval() {

        this.setState({
            planInterval: this.state.planInterval === 'month' ? 'year' : 'month'
        });

    }

}

interface IProps {
    readonly plan: AccountPlan;
    readonly userInfo?: UserInfo;
}

interface IState {
    readonly planInterval: PlanInterval;
}

export type PlanInterval = 'month' | 'year';
