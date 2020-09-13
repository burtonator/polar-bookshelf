import * as React from 'react';
import {Billing} from "polar-accounts/src/Billing";
import {RGBs} from "polar-shared/src/util/Colors";
import CheckIcon from '@material-ui/icons/Check';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import V2PlanLevel = Billing.V2PlanLevel;

interface IProps {
    readonly level: V2PlanLevel;
    readonly active: boolean;
}

class Colors {
    public static FREE = RGBs.create(0, 0, 0);
    public static BRONZE = RGBs.create(205, 127, 50);
    public static SILVER = RGBs.create(207, 207, 207);
    public static GOLD = RGBs.create(252, 194, 0);
}

export const PlanIcon = deepMemo((props: IProps) => {

    // const computeColor = () => {
    //     switch (this.props.plan) {
    //         case "free":
    //             return Colors.FREE;
    //         case "bronze":
    //             return Colors.BRONZE;
    //         case "silver":
    //             return Colors.SILVER;
    //         case "gold":
    //             return Colors.GOLD;
    //     }
    // };
    //
    // const color = computeColor();

    // const border = '2px solid ' + color.toCSS();

    const border = '2px solid black';

    const CheckWhenActive = () => {
        if (props.active) {
            return <CheckIcon/>;
        } else {
            return null;
        }
    };

    return (

        <div style={{
                 display: 'flex',
                 flexDirection: 'column'
             }}>

            <div className=""
                 style={{
                     width: '50px',
                     height: '50px',
                     display: 'flex',
                     boxSizing: 'border-box',
                     borderRadius: '35px',
                     border,
                     // color: color.toCSS()
                 }}>

                <div className="m-auto">
                    <CheckWhenActive/>
                </div>

            </div>

            <div className="ml-auto mr-auto text-md">
                {props.level}
            </div>

        </div>

    );

});
