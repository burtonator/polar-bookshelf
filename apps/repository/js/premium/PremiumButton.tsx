import * as React from 'react';
import {Nav} from '../../../../web/js/ui/util/Nav';
import {AccountActions} from '../../../../web/js/accounts/AccountActions';
import {Billing} from "polar-accounts/src/Billing";
import Button from '@material-ui/core/Button';
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {
    useUserInfoContext,
    useUserSubscriptionContext
} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {usePremiumStore} from './PremiumStore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

const useStyles = makeStyles((theme) =>
    createStyles({
        current_plan: {
            color: theme.palette.secondary.light,
            fontSize: '18px',
            fontWeight: 'bold'
        },
    }),
);


export interface IProps {
    readonly newPlan: Billing.V2PlanLevel;
}

export const PremiumButton = deepMemo((props: IProps) => {

    const classes = useStyles();
    const userInfoContext = useUserInfoContext();
    const subscription = useUserSubscriptionContext();
    const {interval} = usePremiumStore(['interval']);

    const log = useLogger();

    const {newPlan} = props;

    // true when this is the current plan and we do not need to show the
    // button
    const currentPlan = newPlan === subscription.plan.level && subscription.interval === interval;

    const email = userInfoContext?.userInfo?.email;

    // true if we're BUYING a new plan...
    const buyingNewPlan = subscription.plan.level === 'free';

    const text = buyingNewPlan ? "Buy" : "Change Plan";

    const dialogManager = useDialogManager();

    const computeNewPlanID = () => {

        if (interval === 'year') {
            return `${newPlan}_${interval}`;
        }

        return newPlan;

    };

    const newPlanID = computeNewPlanID();

    const buyHandler = () => {
        // if we're buying a NEW product go ahead and redirect us to
        // stripe and use their BUY package.  This is better than embedding
        // the stripe SDK and also stripe ALSO needs to run over HTTPS

        if (email) {

            const params = {
                email: encodeURIComponent(email)
            };

            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=${params.email}&plan=${newPlanID}`);
        } else {
            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?plan=${newPlanID}`);
        }

    };

    const changeHandler = () => {

        const onAccept = () => {

            console.log("Changing plan to: " + newPlanID);

            dialogManager.snackbar({message: `Changing plan to ${newPlan} (${interval}).  One moment...`});

            AccountActions.changePlan(newPlan, interval)
                          .catch(err => log.error("Unable to upgrade plan: ", err));

        };

        dialogManager.confirm({
            title: `Are you sure you want to change to ${newPlan}?`,
            subtitle: 'Your billing will automatically be updated and account pro-rated.',
            type: 'warning',
            onAccept
        });

    };

    const handler = buyingNewPlan ? buyHandler : changeHandler;

    return (
        <div>

            {currentPlan && (
                <span className={classes.current_plan}>CURRENT PLAN</span>
            )}

            {! currentPlan && (
                <Button color="primary"
                        variant="contained"
                        onClick={() => handler()}>

                    {text}

                </Button>)}

        </div>
    );
})
