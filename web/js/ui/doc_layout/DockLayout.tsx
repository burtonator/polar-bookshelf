import * as React from 'react';
import {MousePositions} from './MousePositions';
import {Tuples} from "polar-shared/src/util/Tuples";
import {IDStr} from "polar-shared/src/util/Strings";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {DockSplitter} from "./DockSplitter";
import {deepMemo} from "../../react/ReactUtils";
import {useRefState} from "../../hooks/ReactHooks";
import { useDockLayoutStore, useDockLayoutCallbacks } from './DockLayoutStore';
import {useComponentDidMount} from "../../hooks/ReactLifecycleHooks";

class Styles {

    public static Dock: React.CSSProperties = {
        display: 'flex',
        flexGrow: 1,
        minHeight: 0
    };

}

interface IProps {
    readonly dockPanels: ReadonlyArray<DockPanel>;
    readonly onResize?: Callback;
}

/**
 * A simple expand/collapse dock with a persistent mode where it stays docked
 * next time you open the UI and a temporary mode too where it expand when the
 * toggle button is pushed.
 *
 */
export const DockLayout = deepMemo((props: IProps) => {

    const mousePosition = React.useRef(MousePositions.get());
    const mouseDown = React.useRef(false);
    const {panels} = useDockLayoutStore(['panels']);
    const {setPanels} = useDockLayoutCallbacks();

    const createFixedDocPanelStateMap = (): FixedDocPanelStateMap => {

        const result: FixedDocPanelStateMap = {};

        for (const docPanel of props.dockPanels) {

            if (docPanel.type === 'fixed') {
                result[docPanel.id] = {
                    id: docPanel.id,
                    width: docPanel.width || 400
                };
            }

        }

        return result;

    };

    const [, setState, stateRef] = useRefState<IState>({
        resizing: undefined,
    });

    if (Object.keys(panels).length === 0) {
        setPanels(createFixedDocPanelStateMap());
    }

    const createDockPanels = React.useCallback((): ReadonlyArray<JSX.Element> => {

        const tuples = Tuples.createSiblings(props.dockPanels.filter(current => ! current.disabled));

        const result: JSX.Element[] = [];

        const createBaseStyle = (): React.CSSProperties => {

            const style = {
                overflow: 'auto',
            };

            if (stateRef.current.resizing) {
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

            const panel = panels[docPanel.id];

            const {width} = panel;

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
                                               onMouseDown={() => onMouseDown(resizeTarget)}/>;
                result.push(splitter);
            }

        }

        return result;

    }, [panels]);

    const onMouseUp = React.useCallback(() => {
        mousePosition.current = MousePositions.get();
        markResizing(undefined);
    }, [mousePosition]);

    const onMouseDown = React.useCallback((resizeTarget: ResizeTarget) => {

        mousePosition.current = MousePositions.get();

        markResizing(resizeTarget);

        window.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            onMouseUp();
        }, {once: true});

    }, [mousePosition, onMouseUp]);

    const markResizing = React.useCallback((resizeTarget: ResizeTarget | undefined) => {

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

        mouseDown.current = resizeTarget !== undefined;
        setState({...stateRef.current, resizing: resizeTarget});

    }, [mouseDown]);

    const onMouseMove = React.useCallback(() => {

        if (! mouseDown.current) {
            return;
        }

        const lastMousePosition = MousePositions.get();

        const resizeTarget = stateRef.current.resizing!;

        // TODO: this might not be correct with multiple panels
        const mult = resizeTarget.direction === 'left' ? 1 : -1;

        const delta = mult * (lastMousePosition.clientX - mousePosition.current.clientX);

        const panelState = panels[resizeTarget.id];
        const width = panelState.width + delta;

        const newPanelState = {
            ...panelState,
            width
        };

        const newPanels = {
            ...panels
        };

        newPanels[resizeTarget.id] = newPanelState;

        (props.onResize || NULL_FUNCTION)();

        setPanels(panels);

        mousePosition.current = lastMousePosition;

    }, [mousePosition, mouseDown]);


    // I'm not sure how much CPU this is going to save. It might be test
    // to show a sort of live preview of where the bar would go, then drop
    // it there when completed
    const handleMouseMove = React.useMemo(() => Debouncers.create(() => onMouseMove()), [onMouseMove]);

    const docPanels = createDockPanels();

    return (

        <div className="dock-layout"
             style={{...Styles.Dock}}
             onMouseMove={() => handleMouseMove()}
             draggable={false}>

            {...docPanels}

        </div>

    );

});

/**
 * Keeps a map from the ID to the width.
 */
export interface FixedDocPanelStateMap {
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
