import * as React from 'react';
import {MousePositions} from './MousePositions';
import {Tuples} from "polar-shared/src/util/Tuples";
import {IDStr} from "polar-shared/src/util/Strings";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {DockSplitter} from "./DockSplitter";

class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        flexGrow: 1,
        minHeight: 0
    };

}

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export class DockLayout extends React.Component<IProps, IState> {

    private mousePosition = MousePositions.get();

    private mouseDown: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.markResizing = this.markResizing.bind(this);

        const createFixedDocPanelStateMap = (): FixedDocPanelStateMap => {

            const result: FixedDocPanelStateMap = {};

            for (const docPanel of this.props.dockPanels) {

                if (docPanel.type === 'fixed') {
                    result[docPanel.id] = {
                        id: docPanel.id,
                        width: docPanel.width || 400
                    };
                }

            }

            return result;

        };

        this.state = {
            resizing: undefined,
            panels: createFixedDocPanelStateMap()
        };

    }

    public render() {

        const createDockPanels = (): ReadonlyArray<JSX.Element> => {

            const tuples = Tuples.createSiblings(this.props.dockPanels.filter(current => ! current.disabled));

            const result: JSX.Element[] = [];

            const createBaseStyle = (): React.CSSProperties => {

                const style = {
                    overflow: 'auto',
                };

                if (this.state.resizing) {
                    return {
                        ...style,
                        pointerEvents: 'none',
                        userSelect: 'none'
                    };
                } else {
                    return style;
                }

            };

            const createFixedDockPanelElement = (docPanel: FixedDockPanel, idx: number): JSX.Element => {

                const panelState = this.state.panels[docPanel.id];

                const {width} = panelState;

                const baseStyle = createBaseStyle();

                const style: React.CSSProperties = {
                    ...baseStyle,
                    width,
                    maxWidth: width,
                    minWidth: width,
                    ...(docPanel.style || {})
                };

                return (
                    <div className="dock-layout-fixed"
                         style={style}
                         key={idx}
                         id={docPanel.id}>
                        {docPanel.component}
                    </div>
                );

            };

            const createGrowDockPanelElement = (docPanel: GrowDockPanel, idx: number): JSX.Element => {

                const style: React.CSSProperties = {
                    ...createBaseStyle(),
                    flexGrow: docPanel.grow || 1,
                    ...(docPanel.style || {})
                };

                return (
                    <div className="dock-layout-grow" style={style} key={idx} id={docPanel.id}>
                        {docPanel.component}
                    </div>
                );

            };

            const createDocPanelElement = (docPanel: DockPanel, idx: number): JSX.Element => {

                if (docPanel.type === 'fixed') {
                    return createFixedDockPanelElement(docPanel, idx);
                }

                return createGrowDockPanelElement(docPanel, idx);

            };

            for (const tuple of tuples) {

                result.push(createDocPanelElement(tuple.curr, tuple.idx));

                const computeResizeTarget = (): ResizeTarget => {

                    if (tuple.curr.type === 'fixed') {
                        return {
                            id: tuple.curr.id,
                            direction: 'left'
                        };
                    }

                    return {
                        id: tuple.next!.id,
                        direction: 'right'
                    };

                };

                if  (tuple.next !== undefined) {
                    const resizeTarget = computeResizeTarget();
                    const splitter = <DockSplitter key={'splitter-' + tuple.idx}
                                                   onMouseDown={() => this.onMouseDown(resizeTarget)}/>;
                    result.push(splitter);
                }

            }

            return result;

        };

        const docPanels = createDockPanels();

        // I'm not sure how much CPU this is going to save. It might be test
        // to show a sort of live preview of where the bar would go, then drop
        // it there when completed
        const handleMouseMove = Debouncers.create(() => this.onMouseMove());

        return (

            <div className="dock-layout"
                 style={{...Styles.Dock}}
                 onMouseMove={() => handleMouseMove()}
                 draggable={false}>

                {...docPanels}

            </div>

        );
    }

    private onMouseUp() {

        this.mousePosition = MousePositions.get();

        this.markResizing(undefined);
    }

    private onMouseDown(resizeTarget: ResizeTarget) {

        this.mousePosition = MousePositions.get();

        this.markResizing(resizeTarget);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            this.onMouseUp();
        }, {once: true});

    }

    private markResizing(resizeTarget: ResizeTarget | undefined) {

        const toggleUserSelect = (resizing: boolean) => {
            // this is a hack to disable user select of the document to prevent
            // parts of the UI from being selected

            if (resizing) {
                document.body.style.userSelect = 'none';
            } else {
                document.body.style.userSelect = 'auto';
            }

        };

        toggleUserSelect(resizeTarget !== undefined);

        this.mouseDown = resizeTarget !== undefined;
        this.setState({...this.state, resizing: resizeTarget});
    }

    private onMouseMove() {

        if (!this.mouseDown) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const resizeTarget = this.state.resizing!;

        // TODO: this might not be correct with multiple panels
        const mult = resizeTarget.direction === 'left' ? 1 : -1;

        const delta = mult * (lastMousePosition.clientX - this.mousePosition.clientX);

        const panelState = this.state.panels[resizeTarget.id];
        const width = panelState.width + delta;

        const newPanelState = {
            ...panelState,
            width
        };

        const newPanels = {
            ...this.state.panels
        };

        newPanels[resizeTarget.id] = newPanelState;

        (this.props.onResize || NULL_FUNCTION)();

        this.setState({
            ...this.state,
            panels: newPanels
        });

        this.mousePosition = lastMousePosition;

    }

}

interface IProps {

    /**
     * The configuration of the panels.
     */
    readonly dockPanels: ReadonlyArray<DockPanel>;

    readonly onResize?: Callback;

}


/**
 * Keeps a map from the ID to the width.
 */
interface FixedDocPanelStateMap {
    [id: string]: FixedDocPanelState;
}

interface FixedDocPanelState {
    readonly id: string;
    readonly width: CSSWidth;
}

export interface ResizeTarget {
    readonly id: IDStr;
    readonly direction: 'left' | 'right';
}

interface IState {

    /**
     * The id of the panel we are resizing or undefined if not being resized.
     */
    readonly resizing: ResizeTarget | undefined;

    readonly panels: FixedDocPanelStateMap;

}


/**
 * A CSS width in CSS units (px, em, etc).
 */
export type CSSWidth = number;

export type DocPanelType = 'fixed' | 'grow';

export interface BaseDockPanel {
    readonly id: string;
    readonly type: DocPanelType;
    readonly disabled?: boolean;
    readonly style?: React.CSSProperties;
}

export interface FixedDockPanel extends BaseDockPanel {
    readonly type: 'fixed';
    readonly component: JSX.Element;
    readonly width?: CSSWidth;
}

export interface GrowDockPanel extends BaseDockPanel {
    readonly type: 'grow';
    readonly component: JSX.Element;
    readonly grow?: number;
}

export type DockPanel = FixedDockPanel | GrowDockPanel;
