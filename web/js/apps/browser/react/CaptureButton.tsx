import * as React from 'react';
import {Button, InputGroupAddon} from 'reactstrap';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {ISimpleReactor} from '../../../reactor/SimpleReactor';
import {NavigationEvent} from '../BrowserApp';

export class CaptureButton extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.onTriggerCapture = this.onTriggerCapture.bind(this);
    }

    public render() {

        return (

            <InputGroupAddon addonType="append">

                <Button type="button"
                        className="btn"
                        color="primary"
                        title="Capture the HTML page and save locally"
                        aria-label=""
                        disabled={this.props.disabled}
                        // disabled
                        onClick={this.onTriggerCapture}>

                    <span className="fas fa-cloud-download-alt fa-lg" aria-hidden="true"></span>

                </Button>

            </InputGroupAddon>

        );
    }

    private onTriggerCapture() {
        Optional.of(this.props.onTriggerCapture).map(callback => callback());
    }

}

interface IProps {

    disabled?: boolean;
    onTriggerCapture?: () => void;

}
