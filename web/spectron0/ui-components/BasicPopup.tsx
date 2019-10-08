import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Button} from "reactstrap";

const log = Logger.create();


export class BasicPopup extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);

        this.state = {
            open: false,
        };

    }

    private toggle() {
        console.log("FIXME: toggle");
        this.setState({open: ! this.state.open});
    }

    public render() {

        return (

            <div>
                <Button id="Popover1" type="button">
                    Launch Popover
                </Button>
                <Popover placement="bottom" isOpen={this.state.open} target="Popover1" toggle={this.toggle} trigger="legacy" fade={false} delay={{show: 0, hide: 0}}>
                    <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                </Popover>
            </div>

        );

    }

}

export interface IProps {

}

interface IState {

    readonly open: boolean;

}

