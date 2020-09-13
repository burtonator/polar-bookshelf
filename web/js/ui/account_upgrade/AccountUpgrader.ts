import {AccountUpgrades, AccountUsage} from "../../accounts/AccountUpgrades";
import {Logger} from "polar-shared/src/logger/Logger";
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";
import {Plans} from "polar-accounts/src/Plans";
import {MachineDatastoreHooks} from "../../telemetry/MachineDatastoreHooks";
import {Billing} from "polar-accounts/src/Billing";
import useMachineDatastoreSnapshot = MachineDatastoreHooks.useMachineDatastoreSnapshots;
import V2Plan = Billing.V2Plan;

const log = Logger.create();

export interface IAccountUpgrade {
    readonly required: boolean;
    readonly toPlan: V2Plan;
}

/**
 * True when the account needs to be upgraded..
 */
export function useAccountUpgrader(): IAccountUpgrade | undefined {

    const userInfoContext = useUserInfoContext();
    const [machineDatastore] = useMachineDatastoreSnapshot();

    if (! userInfoContext?.userInfo) {
        return undefined;
    }

    if (! machineDatastore) {
        return undefined;
    }

    const plan = Plans.toV2(userInfoContext?.userInfo?.subscription?.plan || 'free');

    const accountUsage: AccountUsage = {
        created: userInfoContext?.userInfo?.creationTime,
        storageInBytes: machineDatastore.storageInBytes
    }

    const toPlan = AccountUpgrades.computePlanRequiredForAccount(plan, accountUsage);

    const required = plan.level !== toPlan.level;

    if (required) {
        log.warn(`Current account needs to be upgrade from ${plan.level} to ${toPlan}`);
    }

    return {required, toPlan};

}

/**
 * Looks at the amount of storage used, etc to verify that the user doesn't need to upgrade.
 */
export class AccountUpgrader {

    public startUpgrade() {

        // Analytics.event({category: 'upgrades', action: 'required-upgrade-triggered'});
        //
        // UpgradeRequiredMessageBoxes.create();

    }

}
