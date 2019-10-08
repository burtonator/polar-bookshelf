import * as React from 'react';
import {prepareContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuHandlers} from '@burtonator/react-context-menu-wrapper';
import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import {ContextMenu} from '../../js/ui/context_menu/ContextMenu';
import Dropdown, {DropdownMenu, MenuItem} from '@burtonator/react-dropdown';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {KeyBoundMenuItem} from './KeyBoundMenuItem';

let sequence: number = 0;

export class DocContextMenu extends React.Component<IProps, IState> {

    private contextMenuHandlers: ContextMenuHandlers;

    private id: string;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.id = 'doc-context-menu-' + sequence++;

        this.contextMenuHandlers = prepareContextMenuHandlers({id: this.id});

    }

    public render() {

        return (

            <div>

                <div {...this.contextMenuHandlers}>
                    {this.props.children}
                </div>

                <ContextMenuWrapper id={this.id}>

                    <Dropdown open={true}
                              onToggle={NULL_FUNCTION}
                              onSelect={NULL_FUNCTION}>

                        <DropdownMenu>

                            <MenuItem onSelect={() => this.props.onSetTitle()}>

                                <KeyBoundMenuItem text="Set Title" keyBinding="C-t"/>

                            </MenuItem>

                            <MenuItem onSelect={() => this.props.onSetTitle()}>

                                <KeyBoundMenuItem text="Do something else" keyBinding="C-f"/>

                            </MenuItem>


                            <MenuItem onSelect={() => this.props.onSetTitle()}>

                                <div className="text-danger">
                                    Delete
                                </div>

                            </MenuItem>

                        </DropdownMenu>

                    </Dropdown>

                </ContextMenuWrapper>

            </div>

        );

    }

}


interface IProps {
    onSetTitle: () => void;
}

interface IState {
}


