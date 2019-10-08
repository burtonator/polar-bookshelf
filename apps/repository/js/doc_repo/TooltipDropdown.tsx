import * as React from 'react';
import Dropdown, {Direction} from 'reactstrap/lib/Dropdown';
import Tooltip from 'reactstrap/lib/Tooltip';

/**
 * A dropdown that has a tooltip.
 */
export class TooltipDropdown extends React.Component<IProps, IState> {

    private show: number;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.toggleTooltip = this.toggleTooltip.bind(this);

        this.state = {
            open: false,
            tooltip: false,
            tooltipDisplayed: 0
        };

        this.show = this.props.tooltip.show !== undefined ? this.props.tooltip.show : 500;

    }

    public render() {

        return (

            <Dropdown id={this.props.id}
                      isOpen={this.state.open}
                      toggle={() => this.toggle()}
                      direction={this.props.direction}
                      size={this.props.size}>

                {this.props.children}

                <Tooltip placement={this.props.tooltip.placement}
                         style={{maxWidth: '325px',
                                textAlign: 'justify'}}
                         isOpen={this.state.tooltip}
                         target={this.props.id}
                         delay={{show: this.show, hide: 0}}
                         toggle={this.toggleTooltip}>

                    {this.props.tooltip.text}

                </Tooltip>

            </Dropdown>

        );

    }

    private toggle(): void {

        const open = !this.state.open;

        const tooltip: boolean = false;

        this.setState({...this.state, open, tooltip});

    }

    private toggleTooltip(): void {

        const tooltipSupported = (Date.now() - this.state.tooltipDisplayed) > this.show;

        const tooltip: boolean =
            this.state.open || ! tooltipSupported ? false : !this.state.tooltip;

        const tooltipDisplayed: number = Date.now();

        this.setState({...this.state, tooltip, tooltipDisplayed});

    }


}

interface IProps {

    readonly id: string;
    readonly direction?: Direction;
    readonly size?: string;

    readonly tooltip: TooltipProps;
}

interface TooltipProps {
    readonly text: string;
    readonly placement: 'top' | 'bottom' | 'left' | 'right';
    readonly show?: number;
}

interface IState {

    readonly open: boolean;

    /**
     * True when the tooltip is open.
     */
    readonly tooltip: boolean;

    /**
     * The last time the tooltip was displayed
     */
    readonly tooltipDisplayed: number;

}
