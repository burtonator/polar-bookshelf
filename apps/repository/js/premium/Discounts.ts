import {PlanInterval} from "./PremiumContent";
import {Billing} from "polar-accounts/src/Billing";

export interface Discount {
    readonly interval: Billing.Interval;
    readonly plan: Billing.V2PlanLevel;
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

    public get(interval: PlanInterval, plan: Billing.V2PlanLevel): Discount | undefined {
        const key = Discounts.key(interval, plan);
        return this.delegate[key] || undefined;
    }

    private static key(interval: PlanInterval, plan: Billing.V2PlanLevel) {
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
