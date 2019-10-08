import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {NullCollapse} from '../../js/ui/null_collapse/NullCollapse';

export class SubscriptionPlan extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {props} = this;

        const border = this.props.selected ? 'border-success' : 'border-secondary';

        return (

            <div className={"p-2 m-1 shadow rounded border " + border}
                 style={{width: '8em'}}>

                <div style={{display: 'flex'}}>
                    <div className="mt-auto mb-auto">
                        <span className="text-bold text-lg">{props.name}</span>
                    </div>

                    <div className="mt-auto mb-auto ml-auto">

                        <NullCollapse open={props.selected}>
                            <i className="text-xxl text-success far fa-check-circle"></i>
                        </NullCollapse>

                    </div>

                </div>

                <div className="">
                    <span className="text-bold text-grey900 text-xxxl">{props.capacity}</span>
                    <span className="text-bold text-grey900 text-lg"> {props.unit}</span>
                </div>

                <div className="">
                    <span className="text-xxl text-grey400">$<span className="text-bold text-grey800">{props.price}</span></span>
                    <span className="text-grey300 text-md"> / mo</span>
                </div>
            </div>

        );
    }

}


interface IProps {
    readonly name: string;
    readonly capacity: string;
    readonly unit: string;
    readonly price: string;
    readonly selected?: boolean;
}

interface IState {

}
