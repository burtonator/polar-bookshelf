import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CancelSubscriptionButton} from "./PremiumContent";
import React from "react";
import {useUserSubscriptionContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";

export const CancelPlan = deepMemo(() => {

    const {plan} = useUserSubscriptionContext();

    if (plan.level === 'free') {
        return null;
    }

    return (
        <>
            <hr/>
            <p>
                ... and of course in the ultra-rare case that Polar didn't work out you can always cancel at any time.
            </p>

            <CancelSubscriptionButton />
        </>
    );
});

