import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

export interface AccountUsage {
    readonly storageInBytes: number;
}

export interface AccountInit {

    readonly plan: AccountPlan;

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

export type AccountPlan = 'free' | 'bronze' | 'silver' | 'gold';

export class AccountPlans {

    public static toInt(plan: AccountPlan) {

        switch (plan) {
            case "free":
                return 0;
            case "bronze":
                return 1;
            case "silver":
                return 2;
            case "gold":
                return 3;
        }

    }

}
