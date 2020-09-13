import * as React from 'react';
import {AccountUpgrades, AccountUsage} from "../../accounts/AccountUpgrades";
import {UpgradeRequired} from "./UpgradeRequired";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Link} from "react-router-dom";
import {Billing} from 'polar-accounts/src/Billing';
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";
import {deepMemo} from "../../react/ReactUtils";
import {useAccountUpgrader} from "./AccountUpgrader";

const MESSAGE = createRandomizedUpgradeMessage();

interface UpgradeRequiredProps {
    readonly planRequired?: Billing.Plan;
}

const GoPremium = (props: UpgradeRequiredProps) => {

    Analytics.event({category: 'upgrade', action: 'triggered-upgrade-required'});

    const onClick = () => {
        Analytics.event({category: 'upgrade', action: 'clicked-button-to-plans'});
    };

    return <div className="mt-1 mb-1 p-1 rounded"
                style={{
                    backgroundColor: '#ffcccc',
                    fontWeight: 'bold'
                }}>

        <Link to={{pathname: '/plans'}}>
            <Button color="primary"
                    variant="contained"
                    style={{fontWeight: 'bold'}}
                    onClick={() => onClick()}>

                <i className="fas fa-certificate"/>
                &nbsp;
                Go Premium!

            </Button>
        </Link>

        <span className="ml-1">
            {MESSAGE}
        </span>

    </div>;

};


const NullComponent = () => {
    return <div/>;
};


interface IProps {
    readonly plan?: Billing.Plan;
    readonly accountUsage?: AccountUsage;
}

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export const AccountUpgradeBarView = deepMemo((props: IProps) => {

    const {plan} = props;

    const accountUpgrade = useAccountUpgrader();

    if (accountUpgrade?.required) {
        return <UpgradeRequired planRequired={accountUpgrade.toPlan}/>;
    }

    if (! plan || plan === 'free') {
        return <GoPremium/>;
    } else {
        return <NullComponent/>;
    }

});

function  createRandomizedUpgradeMessage() {

    const messages = [
        "Want a dark mode? How about ePub support? Go premium and support Polar development!",
        "Premium users help support future Polar development and are generally pretty awesome.",
        "Guess who else used Polar Premium? Einstein! You want to be like Einstein don't you?",
        "It's scientifically proven that Polar premium adds 100 years to your life!",
        "Polar Premium users help keep Polar ad-free and no annoying banners (like this one).",
        "Keep Polar ad-free!  Upgrading to premium helps support Polar and unlocks additional storage."
    ];

    const randomized = Arrays.shuffle(...messages);

    return Arrays.first(randomized);

}
