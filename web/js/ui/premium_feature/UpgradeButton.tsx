import {useHistory} from "react-router-dom";
import React from "react";
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {Billing} from "polar-accounts/src/Billing";

interface IProps {
    readonly required: Billing.Plan;
    readonly feature: string;
}

export const UpgradeButton = (props: IProps) => {

    const history = useHistory();
    const {required, feature} = props;

    return (
        <Button variant="contained"
                size="small"
                className="border"
                startIcon={<LockOpenIcon/>}
                onClick={() => history.push("/plans")}>

            Upgrade to {required} to unlock {feature}

        </Button>
    );

};
