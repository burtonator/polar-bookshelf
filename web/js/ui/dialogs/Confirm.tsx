import React from 'react';
import {Button} from 'reactstrap';
import {DialogContainer} from './DialogContainer';
import {NullCollapse} from '../null_collapse/NullCollapse';

class Styles {

    public static title: React.CSSProperties = {
        fontSize: "20px",
        fontWeight: "bold"
    };

    public static subtitle: React.CSSProperties = {
        fontSize: "16px"
    };

    public static button: React.CSSProperties = {
        fontSize: "14px"
    };

}

export class Confirm extends React.PureComponent<ConfirmProps, IState> {

    constructor(props: any) {
        super(props);

        this.onConfirm = this.onConfirm.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

    }

    public render() {

        return (

            <DialogContainer open={true}>

                <div onKeyDown={(event) => this.onKeyDown(event)}>

                    <div className="w-100 p-1" style={Styles.title}>
                        {this.props.title}
                    </div>

                    <div className="w-100 p-1 text-muted" style={Styles.subtitle}>
                        {this.props.subtitle || ""}
                    </div>

                    <div className="text-right mt-1">

                        <NullCollapse open={! this.props.noCancel}>

                            <Button color="secondary"
                                    style={Styles.button}
                                    size="sm"
                                    className="m-1"
                                    onClick={() => this.onCancel()}>Cancel</Button>

                        </NullCollapse>

                        <Button color="danger"
                                style={Styles.button}
                                size="sm"
                                className="m-1"
                                onClick={() => this.onConfirm()}>Confirm</Button>

                    </div>

                </div>

            </DialogContainer>

        );

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.onCancel();
        }

    }

    private onConfirm(): void {
        this.props.onConfirm();
    }

    private onCancel(): void {

        if (this.props.onCancel) {
            this.props.onCancel();
        }

    }

}

export interface ConfirmProps {

    readonly title: string;
    readonly subtitle?: string;
    readonly onCancel?: () => void;
    readonly onConfirm: () => void;
    readonly type?: 'danger';
    readonly noCancel?: boolean;

}

export interface IState {

}
