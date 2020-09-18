import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {usePremiumCallbacks, usePremiumStore} from "./PremiumStore";
import React from "react";
import Button from "@material-ui/core/Button";

export const PlanIntervalButton = deepMemo(() => {

    const {interval} = usePremiumStore(['interval']);
    const {toggleInterval} = usePremiumCallbacks();

    return (
        <Button color="secondary"
                variant="contained"
                onClick={toggleInterval}>

            Show {interval === 'month' ? 'Yearly' : 'Monthly'} Plans

        </Button>
    );

});
