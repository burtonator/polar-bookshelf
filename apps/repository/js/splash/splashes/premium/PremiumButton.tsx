import * as React from 'react';
import {Nav} from '../../../../../../web/js/ui/util/Nav';
import {UserInfo} from '../../../../../../web/js/apps/repository/auth_handler/AuthHandler';
import {AccountActions} from '../../../../../../web/js/accounts/AccountActions';
import {NullCollapse} from '../../../../../../web/js/ui/null_collapse/NullCollapse';
import {Billing} from "polar-accounts/src/Billing";
import Button from '@material-ui/core/Button';
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {useLogger} from "../../../../../../web/js/mui/MUILogger";

export interface IProps {
    readonly from: Billing.Plan;
    readonly to: Billing.Plan;
    readonly interval: Billing.Interval;
    readonly userInfo?: UserInfo;
}

export function PremiumButton(props: IProps) {

    const log = useLogger();

    const {to, from, userInfo, interval} = props;

    // true when this is the current plan and we do not need to show the
    // button
    const currentPlan = to === from;

    const email = userInfo ? userInfo.email : undefined;

    // true if we're BUYING a new plan...
    const buy = from === 'free';

    const text = buy ? "Buy" : "Upgrade";

    const dialogManager = useDialogManager();

    const computePlan = () => {

        if (interval === 'year') {
            return `${to}_${interval}`;
        }

        return to;

    };

    const plan = computePlan();

    const buyHandler = () => {
        // if we're buying a NEW product go ahead and redirect us to
        // stripe and use their BUY package.  This is better than embedding
        // the stripe SDK and also stripe ALSO needs to run over HTTPS

        if (email) {

            const params = {
                email: encodeURIComponent(email)
            };

            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=${params.email}&plan=${plan}`);
        } else {
            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?plan=${plan}`);
        }

    };

    const changeHandler = () => {

        const onAccept = () => {

            console.log("Changing plan to: " + to);

            dialogManager.snackbar({message: `Changing plan to ${to}, interval: ${interval}.  One moment...`});

            AccountActions.changePlan(to, interval)
                          .catch(err => log.error("Unable to upgrade plan: ", err));

        };

        dialogManager.confirm({
            title: `Are you sure you want to change to ${to}?`,
            subtitle: 'Your billing will automatically be updated and account pro-rated.',
            type: 'warning',
            onAccept
        });

    };

    const handler = buy ? buyHandler : changeHandler;

    return (
        <div>

            <NullCollapse open={!currentPlan}>

                <Button color="primary"
                        variant="contained"
                        onClick={() => handler()}>

                    {text}

                </Button>

            </NullCollapse>

        </div>
    );
}
