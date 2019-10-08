import * as React from 'react';
import {MousePositions} from '../../../spectron0/ui-components/MousePositions';
import {ChannelCoupler} from '../../util/Channels';
import {defaultValue} from 'polar-shared/src/Preconditions';


class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        flexGrow: 1,
        height: '100%'
    };

}

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export class Dock extends React.Component<IProps, IState> {

    private mousePosition = MousePositions.get();

    private mouseDown: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.toggle = this.toggle.bind(this);
        this.setFlyout = this.setFlyout.bind(this);
        this.markResizing = this.markResizing.bind(this);

        if (this.props.toggleCoupler) {
            this.props.toggleCoupler(() => this.toggle());
        }

        if (this.props.setFlyoutCoupler) {
            this.props.setFlyoutCoupler(() => this.setFlyout());
        }

        const mode = this.props.initialMode ? this.props.initialMode : 'expanded';
        const width = this.props.initialWidth || 400;
        const flyout = defaultValue(this.props.initialFlyout, false);

        this.state = {
            mode,
            width,
            resizing: false,
            flyout
        };

    }

    public render() {

        const leftStyle: React.CSSProperties = {};
        const rightStyle: React.CSSProperties = {};

        for (const style of [leftStyle, rightStyle]) {
            style.height = '100%';
        }

        const createSplitterStyle = () => {

            // TODO: might be better to create a map indexed by 'side' and then
            // just read that directly and have all the props enumerated
            // clearly and no if statement.

            const result: React.CSSProperties = {
                width: '4px',
                minWidth: '4px',
                maxWidth: '4px',
                cursor: 'col-resize',
                backgroundColor: '#c6c6c6'
            };

            if (this.props.side === 'left') {
                result.marginLeft = 'auto';
            } else {
                result.marginRight = 'auto';
            }

            return result;

        };

        const splitterStyle = createSplitterStyle();

        const sidebarStyle = this.props.side === 'left' ? leftStyle : rightStyle;
        const contentStyle = this.props.side === 'right' ? leftStyle : rightStyle;

        const width = this.state.mode === 'expanded' ? this.state.width : 0;

        if (this.state.resizing) {

            for (const style of [sidebarStyle, contentStyle]) {
                style.pointerEvents = 'none';
                style.userSelect = 'none';
            }

        }

        if (this.state.flyout) {
            sidebarStyle.position = 'absolute';
        }

        sidebarStyle.width = width;
        sidebarStyle.minWidth = width;
        sidebarStyle.maxWidth = width;
        contentStyle.flexGrow = 1;

        // force it to be 100% and make the inner elements use overflow
        sidebarStyle.height = '100%';

        const componentClassNames = this.props.componentClassNames || {};

        return (

            <div className="dock"
                 style={{...Styles.Dock, ...this.props.style || {}}}
                 onMouseMove={() => this.onMouseMove()}
                 draggable={false}>

                <div className={"dock-left" + ' ' + componentClassNames.left || ""}
                     style={leftStyle}
                     draggable={false}>

                     {this.props.left}

                </div>

                <div className={"dock-splitter" + ' ' + componentClassNames.splitter || ""}
                     draggable={false}
                     onMouseDown={() => this.onMouseDown()}
                     style={splitterStyle}>

                </div>

                <div className={"dock-right" + ' ' + componentClassNames.right || ""}
                     style={rightStyle}
                     draggable={false}>
                    {this.props.right}
                </div>

            </div>

        );
    }

    private onMouseUp() {

        // console.log("up");

        this.mousePosition = MousePositions.get();

        this.markResizing(false);
    }

    private onMouseDown() {

        this.mousePosition = MousePositions.get();

        this.markResizing(true);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            this.onMouseUp();
        }, {once: true});

    }

    private markResizing(resizing: boolean) {
        this.mouseDown = resizing;
        this.setState({...this.state, resizing});
    }

    private onMouseMove() {
        // console.log("move");

        if (!this.mouseDown) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const mult = this.props.side === 'left' ? 1 : -1;

        const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);

        const width = this.state.width + delta;

        this.setState({...this.state, width});

        this.mousePosition = lastMousePosition;

    }

    private toggle() {

        const newMode = () => {

            switch (this.state.mode) {

                case 'expanded':
                    return 'collapsed';
                case 'collapsed':
                    return 'expanded';

            }

        };

        const mode = newMode();

        this.setState({...this.state, mode});

    }


    private setFlyout() {

        console.log("setting as flyout ");

        const flyout = ! this.state.flyout;

        const newState = {...this.state, flyout};
        console.log("newState: ", newState);
        this.setState(newState);

    }


}

interface IProps {

    readonly style?: React.CSSProperties;

    readonly initialMode?: DockMode;

    readonly initialWidth?: number;

    readonly initialFlyout?: boolean;

    readonly side: DockSide;

    readonly left: JSX.Element;

    readonly right: JSX.Element;

    readonly componentClassNames?: ComponentClassNames;

    readonly toggleCoupler?: ChannelCoupler<void>;

    readonly setFlyoutCoupler?: ChannelCoupler<void>;

}

interface IState {

    readonly mode: DockMode;

    readonly width: number;

    /**
     * True when we're in the middle of resizing the dock.
     */
    readonly resizing: boolean;

    readonly flyout: boolean;

}

/**
 * The DocMode specifies which side is expanded by default (the right or left).
 */
export type DockSide = 'left' | 'right';

export type DockMode = 'expanded' | 'collapsed';

interface ComponentClassNames {
    readonly left?: string;
    readonly splitter?: string;
    readonly right?: string;
}
