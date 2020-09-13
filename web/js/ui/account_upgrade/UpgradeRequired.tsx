import * as React from 'react';
import {Link} from "react-router-dom";
import {Billing} from 'polar-accounts/src/Billing';
import {Analytics} from "../../analytics/Analytics";
import Button from "@material-ui/core/Button";

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class UpgradeRequired extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        Analytics.event({category: 'upgrade', action: 'triggered-upgrade-required'});

        const onClick = () => {
            Analytics.event({category: 'upgrade', action: 'clicked-button-to-plans'});
        };

        return <div className="mt-1 mb-1 p-1 rounded"
                    style={{
                        backgroundColor: '#ffcccc',
                        fontWeight: 'bold',
                        display: 'flex'
                    }}>
            <Link to={{pathname: '/plans'}}>
                <Button color="primary"
                        variant="contained"
                        style={{fontWeight: 'bold'}}
                        onClick={() => onClick()}>

                    <i className="fas fa-certificate"/>
                    &nbsp;
                    Upgrade Now

                </Button>
            </Link>

            <div className="ml-1 mt-auto mb-auto">

                Your account has exceeded limits for your current plan.  Sync will be disabled in 1 week.

            </div>

        </div>;

    }

}

interface IProps {
    readonly planRequired?: Billing.Plan;
}

interface IState {
}


