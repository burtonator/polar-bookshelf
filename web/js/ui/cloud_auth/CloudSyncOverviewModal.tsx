import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import {CloudSyncOverviewContent} from './CloudSyncOverviewContent';

export class CloudSyncOverviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Modal isOpen={this.props.isOpen} size="lg">
                {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                <ModalBody>

                    <CloudSyncOverviewContent/>

                </ModalBody>
                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>

                    <Button color="primary"
                            onClick={() => this.props.onSignup()}>
                        Login
                    </Button>{' '}

                </ModalFooter>
            </Modal>

        );
    }

}

interface IProps {
    readonly isOpen: boolean;
    readonly onCancel: () => void;
    readonly onSignup: () => void;
}

interface IState {

}
