import * as React from 'react';
import {ModalBody} from 'reactstrap';

/**
 * Modal that is large and fits nearly the full screen and has a simple
 * accept button.
 */
export class LargeModalBody extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        // noinspection TsLint
        return (
            <ModalBody style={{
                          overflowY: 'auto',
                          maxHeight: 'calc(100vh - 150px)'
                       }}>

                {this.props.children}

            </ModalBody>
        );
    }

}

interface IProps {

}

interface IState {

}
