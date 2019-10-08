import React from '@types/react';
import {DropdownItem, DropdownMenu, DropdownToggle, InputGroupButtonDropdown} from '@types/reactstrap';

export class BrowserConfigurationInputGroup extends React.Component<any, InternalState> {

    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            open: false
        };
    }

    public render() {
        return (
            <InputGroupButtonDropdown
                title="Configure browser settings for capture"
                addonType="append"
                isOpen={this.state.open}
                toggle={this.toggle}>
                <DropdownToggle caret>
                     <span className="fa fa-chrome fa-lg" aria-hidden="true"></span>
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Browser:</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Mobile Galaxy S8 (412x846)</DropdownItem>
                </DropdownMenu>
            </InputGroupButtonDropdown>
        );
    }

    private toggle(): void {
        this.setState({
            open: !this.state.open
        });
    }

}

interface InternalState {
    open: boolean;
}
