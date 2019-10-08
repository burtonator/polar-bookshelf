import React from 'react';
import {LargeModal} from '../../ui/large_modal/LargeModal';
import {Button, ModalFooter} from 'reactstrap';
import {LargeModalBody} from '../../ui/large_modal/LargeModalBody';
import {LifecycleEvents} from '../../ui/util/LifecycleEvents';
import {LocalPrefs} from '../../util/LocalPrefs';

export class MobileDisclaimer extends React.PureComponent<IProps, IState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onOK = this.onOK.bind(this);

        this.state = {
            open: true
        };

    }

    public render() {

        return (

            <LargeModal isOpen={this.state.open}
                        toggle={() => this.toggle()}>


                <LargeModalBody>

                    <h2>Polar Mobile <b>Preview</b></h2>

                    <p>
                        This is a <b>alpha</b> version of Polar for mobile.
                    </p>

                    <p>
                        It will probably break and not work properly. Feel free
                        to play with it but understand that it's going to have
                        significant bugs.
                    </p>

                </LargeModalBody>

                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.onOK()}>
                        OK
                    </Button>

                </ModalFooter>

            </LargeModal>

        );
    }

    private onOK(): void {
        LocalPrefs.mark(LifecycleEvents.WEBAPP_PREVIEW_WARNING_SHOWN);

        this.setState({open: false});

    }

    private toggle(): void {

        this.setState({...this.state, open: !this.state.open});

    }

}

export interface IProps {


}

export interface IState {
    readonly open: boolean;

}
