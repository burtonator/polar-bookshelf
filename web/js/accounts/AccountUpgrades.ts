/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {AccountPlan, AccountPlans} from "./Account";

export class AccountUpgrades {

    /**
     *
     * Force the user to upgrade to a plan.
     *
     * @param plan current user plan.
     * @param accountUsage The data about the machine that we're needing to upgrade
     */
    public static upgradeRequired(plan: AccountPlan, accountUsage: AccountUsage): AccountPlan | undefined {

        /**
         * Get the required plan per the amount of data being used.
         */
        const computeRequiredPlan = () => {

            const _350MB = 350000000;
            const   _2GB = 2000000000;
            const   _5GB = 5000000000;

            if (accountUsage.storageInBytes >= _350MB && accountUsage.storageInBytes < _2GB) {
                return 'bronze';
            }

            if (accountUsage.storageInBytes >= _2GB && accountUsage.storageInBytes < _5GB) {
                return 'silver';
            }

            if (accountUsage.storageInBytes >= _5GB ) {
                return 'gold';
            }

            return 'free';

        };

        const requiredPlan = computeRequiredPlan();

        if (AccountPlans.toInt(plan) < AccountPlans.toInt(requiredPlan)) {
            return requiredPlan;
        }

        return undefined;

    }

}

export interface AccountUsage {
    readonly storageInBytes: number;
}
