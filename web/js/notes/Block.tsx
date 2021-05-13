import React from "react";
import {BlockEditor} from "./BlockEditor";
import {BlockItems} from "./BlockItems";
import {BlockBulletButton} from "./BlockBulletButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {BlockContextMenuItems} from "./BlockContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import { BlockExpandToggleButton } from "./BlockExpandToggleButton";
import { BlockIDStr, useBlocksStore } from "./store/BlocksStore";
import { observer,  } from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import { BlockDragIndicator } from "./BlockDragIndicator";
import {BlockImageContent} from "./blocks/BlockImageContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {useUndoQueue} from "../undo/UndoQueueProvider2";

const useStyles = makeStyles((theme) =>
    createStyles({
        selected: {
            background: theme.palette.primary.main
        },
    }),
);

interface IProps {
    readonly parent: BlockIDStr | undefined;
    readonly id: BlockIDStr;
}

export interface IBlockContextMenuOrigin {

}

export const [BlockContextMenu, useBlockContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(BlockContextMenuItems, {name: 'notes'});

export const BlockInner = observer((props: IProps) => {

    const {id} = props;

    const blocksStore = useBlocksStore();
    const classes = useStyles();
    const undoQueue = useUndoQueue();

    const theme = useTheme();
    const contextMenuHandlers = useBlockContextMenu();

    const expanded = blocksStore.isExpanded(id);
    const selected = blocksStore.isSelected(id);
    const block = blocksStore.getBlock(id);

    const divRef = React.useRef<HTMLDivElement | null>(null);
    const dragActive = React.useRef<boolean>(false);

    const root = blocksStore.root;

    const handleMouseDown = React.useCallback((event: React.MouseEvent) => {

        if (event.shiftKey) {

            if (blocksStore.active !== undefined) {

                if (blocksStore.active?.id !== id) {

                    blocksStore.setSelectionRange(blocksStore.active.id, id);

                    window.getSelection()!.removeAllRanges();

                }

            }

            // we have to stop propagation here because otherwise it will bubble
            // up to the root and select that.
            event.stopPropagation();

        } else {
            blocksStore.clearSelected('Note: handleMouseDown');
        }

    }, [id, blocksStore]);

    if (! block) {
        return null;
    }

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {
            event.preventDefault();
            event.stopPropagation();
        }

        function computeUndoOperation(): 'undo' | 'redo' | undefined {

            // **** macos

            // *** undo
            if (event.metaKey && event.key === 'z') {
                return 'undo';
            }

            // *** redo
            if (event.metaKey && event.shiftKey && event.key === 'z') {
                abortEvent();
                return 'redo';
            }

            // **** windows

            // *** undo alt+backspace
            if (event.metaKey && event.key === 'Backspace') {
                abortEvent();
                return 'undo';
            }

            // ** undo: ctrl+z
            if (event.ctrlKey && event.key === 'z') {
                abortEvent();
                return 'undo';
            }

            // ** redo: ctrl+y
            if (event.ctrlKey && event.key === 'y') {
                // this is redo..
                return 'redo';
            }

            // ** redo: ctrl+shift+z
            if (event.ctrlKey && event.shiftKey && event.key === 'z') {
                // this is redo..
                return 'redo';
            }

            return undefined;

        }

        const op = computeUndoOperation();

        if (op !== undefined) {

            switch (op) {

                case "undo":
                    undoQueue.undo();
                    break;
                case "redo":
                    undoQueue.redo();
                    break;

            }

            abortEvent();
        }

    }, [undoQueue]);

    const handleDragStart = React.useCallback((event: React.DragEvent) => {
        blocksStore.setDropSource(props.id);
        // event.preventDefault();
        // event.stopPropagation();
    }, [props.id, blocksStore]);

    const computeDragPosition = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        // FIXME: if this is a root note then we can only drag BELOW it...

        if (divRef.current) {

            const bcr = divRef.current.getBoundingClientRect();

            const deltaTop = Math.abs(event.clientY - bcr.top);
            const deltaBottom = Math.abs(event.clientY - bcr.bottom);

            if (deltaTop < deltaBottom) {
                return 'top';
            }

        }

        return 'bottom';

    }, []);

    const updateDropTarget = React.useCallback((event: React.DragEvent | React.MouseEvent) => {

        const pos = computeDragPosition(event);

        blocksStore.setDropTarget({
            id: props.id, pos
        });

    }, [computeDragPosition, props.id, blocksStore]);

    const handleDragEnter = React.useCallback((event: React.DragEvent) => {

        updateDropTarget(event);

        dragActive.current = true;

        event.preventDefault();
        event.stopPropagation();

    }, [updateDropTarget]);

    const handleDragExit = React.useCallback((event: React.DragEvent) => {

        dragActive.current = false;

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleMouseMove = React.useCallback((event: React.MouseEvent) => {

        if (dragActive.current) {
            updateDropTarget(event);
        }

    }, [updateDropTarget]);

    const handleDrop = React.useCallback((event: React.DragEvent) => {

        event.preventDefault();

        // FIXME: do the move now... and actually move the item

        console.log("FIXME: DROP")

    }, []);

    const items = blocksStore.lookup(block.itemsAsArray || []);

    const hasItems = items.length > 0;

    const dropActive = blocksStore.dropTarget?.id === props.id && blocksStore.dropSource !== props.id;

    return (
        <div ref={divRef}
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onKeyDown={handleKeyDown}
             onDragStart={event => handleDragStart(event)}
             onDragEnter={event => handleDragEnter(event)}
             onDragLeave={event => handleDragExit(event)}
             onDragEnd={() => blocksStore.clearDrop()}
             onDrop={event => handleDrop(event)}
             className={clsx(['Block', selected ? classes.selected : undefined])}>

                <BlockDragIndicator id={props.id}>
                    <>
                        <div {...contextMenuHandlers}
                             style={{
                                 display: 'flex',
                                 alignItems: 'flex-start',
                                 boxSizing: 'border-box',
                                 paddingTop: theme.spacing(0.5),
                                 paddingBottom: theme.spacing(0.5),
                                 // background: dropActive ? 'red' : 'inherit'
                             }}>

                            <div style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     minWidth: '3em',
                                     justifyContent: 'flex-end',
                                     marginRight: theme.spacing(0.5)
                                 }}>

                                {/*<NoteOverflowButton id={props.id}/>*/}

                                {hasItems && id !== root && (
                                    <BlockExpandToggleButton id={props.id}/>
                                )}

                                <BlockBulletButton target={props.id}/>

                            </div>

                            {BlockPredicates.isTextBlock(block) && (
                                <BlockEditor key={props.id} parent={props.parent} id={props.id} />
                            )}

                            {block.content.type === 'image' && (
                                <BlockImageContent src={block.content.src}
                                                   width={block.content.width}
                                                   height={block.content.height}/>
                            )}

                        </div>

                        {(expanded || id === root) && (
                            <BlockItems parent={props.id} notes={items}/>
                        )}
                </>
            </BlockDragIndicator>
        </div>
    );
});

export const Block = observer(function Note(props: IProps) {

    // useLifecycleTracer('Note');

    return (
        <BlockContextMenu>
            <BlockInner {...props}/>
        </BlockContextMenu>
    );

});

