import * as React from 'react';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import DropdownItem from 'reactstrap/lib/DropdownItem';

let sequence: number = 0;

export class TabButtonContextMenu extends React.Component<IProps, IState> {

    private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'doc-context-menu2-' + sequence++;

        this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    public render() {

        return (

            <div>

                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <div className="border shadow rounded pt-2 pb-2"
                         style={{backgroundColor: 'white'}}>

                        <DropdownItem toggle={false} onClick={() => this.props.onClose()}>
                            Close Tab
                        </DropdownItem>

                        <DropdownItem toggle={false} onClick={() => this.props.onCloseOtherTabs()}>
                            Close Other Tabs
                        </DropdownItem>

                    </div>

                </ContextMenuWrapper>

            </div>

        );

    }

}


interface IProps {
    readonly onClose: () => void;
    readonly onCloseOtherTabs: () => void;
}

interface IState {
}


