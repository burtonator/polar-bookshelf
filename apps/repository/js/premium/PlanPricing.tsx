import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {usePremiumStore} from "./PremiumStore";
import {Discount} from "./Discounts";
import React from "react";
import {Billing} from "polar-accounts/src/Billing";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) =>
    createStyles({
        price: {
            fontSize: '30px'
        },
        interval: {
            fontSize: '15px',
            color: theme.palette.text.hint
        },
    }),
);


interface IProps {
    readonly plan: Billing.V2PlanLevel;
}

export const PlanPricing = deepMemo((props: IProps) => {

    const classes = useStyles();
    const {interval} = usePremiumStore(['interval']);

    const computeMonthlyPrice = () => {

        switch (props.plan) {
            case "free":
                return 0.0;
            case "plus":
                return 6.99;
            case "pro":
                return 14.99;
        }

    };

    const computeYearlyPrice = () => {
        switch (props.plan) {
            case "free":
                return 0.0;
            case "plus":
                return 74.99;
            case "pro":
                return 164.99;
        }
    };

    const compute4YearPrice = () => {
        switch (props.plan) {
            case "free":
                return 0.0;
            case "plus":
                return 164.99;
            case "pro":
                return 399.99;
        }
    };

    interface Pricing {
        readonly price: number;
        readonly discount: Discount | undefined;
    }

    const computePrice = (): Pricing => {

        const price = interval === 'month' ? computeMonthlyPrice() : computeYearlyPrice();
        // const discount = discounts.get(interval, props.plan);

        return {price, discount: undefined};
    };

    const pricing = computePrice();

    if (pricing.discount) {

        return <div>

            <s>
                <h3 className="">${pricing.discount.before}<span
                    className="">/{interval}</span>
                </h3>
            </s>

            <h3 className="">
                ${pricing.discount.after}<span
                className="">/{interval}</span>
            </h3>

        </div>;

    } else {

        return (
            <div>
                <h3 className={classes.price}>${pricing.price}<span
                    className={classes.interval}>/{interval}</span>
                </h3>
            </div>
        );

    }

});

