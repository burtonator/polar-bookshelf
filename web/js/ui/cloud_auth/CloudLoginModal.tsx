/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {LargeModal} from '../large_modal/LargeModal';
import {WhatsNewContent} from '../../../../apps/repository/js/splash2/whats_new/WhatsNewContent';
import {LargeModalBody} from '../large_modal/LargeModalBody';
import {Firebase} from '../../firebase/Firebase';
import {FirebaseUIAuth} from '../../firebase/FirebaseUIAuth';
import {Nav} from '../util/Nav';

export class CloudLoginModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
        };

    }

    public componentDidMount(): void {
        this.doAuthContainer();
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any): void {
        this.doAuthContainer();
    }

    private doAuthContainer() {

        if (this.props.isOpen) {
            Firebase.init();

            const signInSuccessUrl = Nav.createHashURL('configured');
            FirebaseUIAuth.login({signInSuccessUrl});

        }

    }

    public render() {
        return (

            <LargeModal isOpen={this.props.isOpen}>

                <ModalHeader>Login to Polar</ModalHeader>
                <LargeModalBody>

                    <div id="firebaseui-auth-container"></div>

                </LargeModalBody>
                <ModalFooter>
                    <Button color="secondary"
                            onClick={() => this.props.onCancel()}>
                        Cancel
                    </Button>

                </ModalFooter>


            </LargeModal>

        );
    }

}

interface IProps {
    readonly isOpen: boolean;
    readonly onCancel: () => void;
}

interface IState {
}
