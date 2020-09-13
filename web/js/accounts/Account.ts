import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Billing} from 'polar-accounts/src/Billing';

export interface AccountUsage {
    readonly storageInBytes: number;
}

export interface AccountInit {

    readonly plan: Billing.Plan;
    readonly interval?: Billing.Interval;

}

export interface Account extends AccountInit {

    readonly id: string;

    /**
     * The users uid in Firebase.
     */
    readonly uid: string;

    /**
     * The accounts primary email address.  We might add more in the future.
     */
    readonly email: string;

    /**
     * The last time any important action was changed on the account. Payment
     * updated, etc.
     */
    readonly lastModified: ISODateTimeString;

}

export namespace AccountPlans {

    import V2Plan = Billing.V2Plan;
    import V2PlanFree = Billing.V2PlanFree;
    import V2PlanPlus = Billing.V2PlanPlus;
    import V2PlanPro = Billing.V2PlanPro;

    // export function toColor(plan: Billing.Plan) {
    //     switch (plan) {
    //         case "free":
    //             return "";
    //         case "bronze":
    //             return "#cc6633";
    //         case "silver":
    //             return "#C0C0C0";
    //         case "gold":
    //             return "#D4AF37";
    //     }
    // }

}

