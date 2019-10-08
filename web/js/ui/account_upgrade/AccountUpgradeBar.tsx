import * as React from 'react';
import {MachineDatastore, MachineDatastores} from "../../telemetry/MachineDatastores";
import {Accounts} from "../../accounts/Accounts";
import {Account} from "../../accounts/Account";
import {Logger} from "polar-shared/src/logger/Logger";
import {Firebase} from "../../firebase/Firebase";
import {AccountUpgradeBarView} from "./AccountUpgradeBarView";

const log = Logger.create();

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class AccountUpgradeBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

        const handler = async () => {

            const user = await Firebase.currentUser();

            if (! user) {
                // the user is not using Firebase.
                return;
            }

            const account = await Accounts.get();
            const machineDatastore = await MachineDatastores.get();

            this.setState({...this.state, accountData: {account, machineDatastore}});

        };

        handler().catch(err => log.error("Failed to handle upgrades: ", err));


    }

    public render() {

        if ( ! this.state.accountData) {
            return <div/>;
        }

        const {account, machineDatastore} = this.state.accountData;

        const plan = account ? account.plan : undefined;

        return (
            <AccountUpgradeBarView plan={plan} accountUsage={machineDatastore}/>
        );

    }

}

interface IProps {
}

interface IState {
    readonly accountData?: AccountData;
}

export interface AccountData {
    readonly account?: Account;
    readonly machineDatastore?: MachineDatastore;
}
