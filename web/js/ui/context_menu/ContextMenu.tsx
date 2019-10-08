import {ContextMenuWrapper} from '@burtonator/react-context-menu-wrapper';
import * as React from 'react';
import Dropdown, {DropdownMenu} from "@burtonator/react-dropdown";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

/**
 * Basic context menu that allows you to just specify the menu items as
 * children.
 */
export class ContextMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {

        return (

            <ContextMenuWrapper id={this.props.id}>

                <Dropdown open={true}
                          onToggle={NULL_FUNCTION}
                          onSelect={NULL_FUNCTION}>

                    {/* dropdown and menu items here*/}

                    {this.props.children}

                </Dropdown>

            </ContextMenuWrapper>

        );

    }

}

interface IProps {
    readonly id: string;
}

interface IState {

}
