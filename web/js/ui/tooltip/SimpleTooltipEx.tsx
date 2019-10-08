/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import Tooltip from 'reactstrap/lib/Tooltip';
import {Optional} from 'polar-shared/src/util/ts/Optional';

export class SimpleTooltipEx extends React.Component<IProps, IState> {

    private timeout?: number;

    private id: string;

    private show: number;

    constructor(props: IProps) {
        super(props);

        this.id = 'tooltip-parent-' + Math.floor(1000000 * Math.random());

        this.state = {
            open: false
        };

        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.deactivate = this.deactivate.bind(this);

        this.schedule = this.schedule.bind(this);

        this.trigger = this.trigger.bind(this);

        this.show = Optional.of(this.props.show).getOrElse(1000);

    }

    public render() {

        const placement = this.props.placement || 'bottom';

        return (

            <div className=""
                 onMouseEnter={() => this.onMouseEnter()}
                 onMouseMove={() => this.onMouseMove()}
                 onMouseLeave={() => this.onMouseLeave()}
                 onMouseDown={() => this.deactivate()}
                 onMouseUp={() => this.deactivate()}
                 onClick={() => this.deactivate()}
                 onContextMenu={() => this.deactivate()}>

                <div id={this.id}>
                    {this.props.children}
                </div>

                <Tooltip style={{
                            maxWidth: '325px',
                            textAlign: 'justify',
                            ...this.props.style || {}
                         }}
                         isOpen={this.state.open}
                         className=""
                         placement={placement}
                         delay={{show: 0, hide: 0}}
                         target={this.id}>

                    {this.props.text}

                </Tooltip>

            </div>

        );

    }

    private onMouseEnter() {
        this.schedule();
    }

    private onMouseMove() {

        if (this.show === 0) {
            return;
        }

        if (this.state.open) {
            this.setState({open: false});
        } else {
            this.schedule();
        }

    }

    private onMouseLeave() {
        this.deactivate();
    }

    private deactivate() {

        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }

        this.setState({open: false});

    }

    private schedule() {

        if (this.show === 0) {
            this.trigger();
            return;
        }

        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }

        this.timeout = window.setTimeout(() => this.trigger(), this.show);

    }

    private trigger() {

        if (this.props.disabled) {
            return;
        }

        this.setState({open: true});
    }

}

interface IProps {
    readonly text: string;
    readonly placement?: 'bottom' | 'top' | 'right' | 'left';
    readonly show?: number;
    readonly style?: React.CSSProperties;
    readonly disabled?: boolean;
}

interface IState {
    readonly open: boolean;
}



