import * as React from '@types/react';
import {Button, Input, InputGroup, InputGroupAddon} from '@types/reactstrap';
import Navbar from 'reactstrap/lib/Navbar';
import {BrowserConfigurationInputGroup} from './BrowserConfigurationInputGroup';
import {CaptureButton} from './CaptureButton';

class BrowserNavBar extends React.Component<any, IState> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (

            <div>

                <Navbar light expand="md" className="p-2 border-bottom link-navbar">

                    <InputGroup size="sm" className="">

                        <InputGroupAddon addonType="prepend"
                                         title="Refresh the current page">

                            <Button type="button"
                                    className="btn btn-outline-secondary"
                                    aria-label="">

                                <span className="fa fa-refresh fa-lg" aria-hidden="true"></span>

                            </Button>

                        </InputGroupAddon>

                        <Input className="px-2 mx-1" name="url" />

                        <CaptureButton/>


                        <BrowserConfigurationInputGroup/>

                    </InputGroup>
                </Navbar>

            </div>
        );
    }

}

interface IState {
    dropdownOpen: boolean;
    splitButtonOpen: boolean;

}


