import {PlanInterval} from "./PremiumContent";
import {Billing} from "polar-accounts/src/Billing";

export interface Discount {
    readonly interval: Billing.Interval;
<<<<<<< HEAD:apps/repository/js/splash/splashes/premium/Discounts.ts
    readonly plan: Billing.Plan;
=======
    readonly plan: Billing.V2PlanLevel;
>>>>>>> 373f4a844cb6f5f4fb4e0d18c58b58729b9cb9b5:apps/repository/js/premium/Discounts.ts
    readonly before: number;
    readonly after: number;
}

const XMAS_2019: ReadonlyArray<Discount> = [

];

const DISCOUNTS: ReadonlyArray<Discount> = [];

export interface DiscountMap {
    [key: string]: Discount;
}

export class Discounts {

    constructor(private delegate: DiscountMap = {}) {

    }

<<<<<<< HEAD:apps/repository/js/splash/splashes/premium/Discounts.ts
    public get(interval: PlanInterval, plan: Billing.Plan): Discount | undefined {
=======
    public get(interval: PlanInterval, plan: Billing.V2PlanLevel): Discount | undefined {
>>>>>>> 373f4a844cb6f5f4fb4e0d18c58b58729b9cb9b5:apps/repository/js/premium/Discounts.ts
        const key = Discounts.key(interval, plan);
        return this.delegate[key] || undefined;
    }

<<<<<<< HEAD:apps/repository/js/splash/splashes/premium/Discounts.ts
    private static key(interval: PlanInterval, plan: Billing.Plan) {
=======
    private static key(interval: PlanInterval, plan: Billing.V2PlanLevel) {
>>>>>>> 373f4a844cb6f5f4fb4e0d18c58b58729b9cb9b5:apps/repository/js/premium/Discounts.ts
        return `${interval}:${plan}`;
    }

    public static create() {

        const backing: DiscountMap = {};

        for (const discount of DISCOUNTS) {
            const key = this.key(discount.interval, discount.plan);
            backing[key] = discount;
        }

        return new Discounts(backing);

    }

}
