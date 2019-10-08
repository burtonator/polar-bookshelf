import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Button} from "reactstrap";

const log = Logger.create();


export class FakePopup extends React.Component<IProps, IState> {

    private readonly id = 'fake-popup';

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this.state = {
            open: false,
        };

    }

    private toggle() {
        console.log("FIXME: toggle");
        this.setState({open: ! this.state.open});
    }

    private deactivate() {
        console.log("FIXME: deactivate");
        this.setState({open: false});
    }

    public render() {

        return (

            <div className="mt-auto mb-auto">

                <Button id={this.id}
                        className="fa fa-tag doc-button doc-button-inactive"/>

                <Popover placement="bottom"
                         isOpen={this.state.open}
                         target={this.id}
                         delay={0}
                         toggle={() => this.toggle()}
                         className="tag-input-popover shadow">
                    {/*<PopoverHeader>Popover Title</PopoverHeader>*/}

                    {/*style={{borderWidth: '1px', backgroundColor: true ? "#b94a48" : "#aaa"}}*/}
                    <PopoverBody style={{}} className="shadow">

                        {/*TODO unify this with TagInputWidget*/}

                        this is the fake body

                    </PopoverBody>
                </Popover>

            </div>

        );

    }

    private onCancel() {
        this.setState({...this.state, open: false});
    }

    private onDone() {

        this.setState({...this.state, open: false});


    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.onCancel();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onDone();
        }

    }

}

export interface IProps {

}

interface IState {

    readonly open: boolean;

}

