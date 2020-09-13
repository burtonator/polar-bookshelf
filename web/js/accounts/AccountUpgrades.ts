/**
 * Handles listening for account changes for the user and telling them
 * of changes to their plan over time.
 */
import {Billing} from "polar-accounts/src/Billing";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Plans} from "polar-accounts/src/Plans";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPro = Billing.V2PlanPro;

const _1GB   =   1000000000;
const _2GB   =   2000000000;
const _50GB  =  50000000000;
const _500GB = 500000000000;

export namespace AccountUpgrades {

    export function isV2Grandfathered(created: ISODateTimeString) {
        return ISODateTimeStrings.compare(created, '2020-10-15T00:00:00+0000') < 0;
    }

    /**
     * Get the required plan per the amount of data being used.
     */
    export function computeRequiredPlan(accountUsage: AccountUsage) {

        /**
         * Return true if the user is grandfathered for V2 pricing.
         */
        function computePlan(free: number,
                             plus: number,
                             pro: number) {

            if (accountUsage.storageInBytes < free) {
                return V2PlanFree;
            }

            if (accountUsage.storageInBytes >= free && accountUsage.storageInBytes < plus) {
                return V2PlanPlus;
            }

            if (accountUsage.storageInBytes >= plus && accountUsage.storageInBytes < pro) {
                return V2PlanPro;
            }

            throw new Error("Too much storage: " + accountUsage.storageInBytes);

        }

        function computeV2Grandfathered() {
            return computePlan(_2GB, _50GB, _500GB);
        }

        function computeV2() {
            return computePlan(_1GB, _50GB, _500GB);
        }

        if (isV2Grandfathered(accountUsage.created)) {
            return computeV2Grandfathered();
        } else {
            return computeV2();
        }

    }

    /**
     *
     * Force the user to upgrade to a plan.
     *
     * @param currentPlan current user plan.
     * @param accountUsage The data about the machine that we're needing to upgrade
     */
    export function computePlanRequiredForAccount(currentPlan: Billing.V2Plan,
                                                  accountUsage: AccountUsage): Billing.V2Plan {

        const requiredPlan = computeRequiredPlan(accountUsage);

        if (Plans.toInt(currentPlan) < Plans.toInt(requiredPlan)) {
            return requiredPlan;
        }

        // their current plan is ok.
        return currentPlan;

    }

}

export interface AccountUsage {

    /**
     * The time the account was created.
     */
    readonly created: ISODateTimeString;

    /**
     * The number of bytes of storage the user has.
     */
    readonly storageInBytes: number;
}
