import * as React from 'react';
import {Modal} from 'reactstrap';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

/**
 * Modal that is large and fits nearly the full screen. Must use this with a
 * LargeModalBody.
 */
export class LargeModal extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        const minWidth = this.props.minWidth || '90%';

        // noinspection TsLint
        return (

            <Modal isOpen={this.props.isOpen}
                   size="lg"
                   fade={false}
                   centered={this.props.centered}
                   toggle={this.props.toggle ? this.props.toggle : NULL_FUNCTION}
                   style={{
                       overflowY: 'initial',
                       minWidth
                   }}>

                {this.props.children}

            </Modal>

        );
    }

}

interface IProps {
    readonly centered?: boolean;
    readonly isOpen: boolean;
    readonly toggle?: () => void;
    readonly minWidth?: string;
}

interface IState {

}
