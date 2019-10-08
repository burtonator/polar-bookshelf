import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import {CloudSyncConfiguredContent} from './CloudSyncConfiguredContent';

export class CloudSyncConfiguredModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <Modal isOpen={this.props.isOpen} size="lg">
                {/*<ModalHeader>Polar Cloud Sync</ModalHeader>*/}
                <ModalBody>

                    <CloudSyncConfiguredContent/>

                </ModalBody>
                <ModalFooter>

                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        OK
                    </Button>

                </ModalFooter>
            </Modal>

        );
    }

}

interface IProps {
    readonly isOpen: boolean;
    readonly onCancel: () => void;
}

interface IState {

}
