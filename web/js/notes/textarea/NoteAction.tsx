import React from 'react';
import {IDStr} from "polar-shared/src/util/Strings";
import useTheme from '@material-ui/core/styles/useTheme';
import {ActionMenuItemsProvider, useActionMenuStore} from "../../mui/action_menu/ActionStore";
import {ContentEditables} from "../ContentEditables";
import INodeOffset = ContentEditables.INodeOffset;
import {useNoteContentEditableElement} from "./NoteContentEditable";
import { observer } from "mobx-react-lite"

/**
 * Keyboard handler for while the user types. We return true if the menu is active.
 */
export type ReactKeyboardEventHandler = (event: React.KeyboardEvent, contenteditable: HTMLElement | null) => boolean;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, NoteActionReset];

// TODO: need operations for bold, italics, and any other type of action we want
// to perform here.

/**
 * Link to a node.
 */
export interface IActionOpWithNodeLink {
    readonly type: 'note-link';
    readonly target: string;
}

export type ActionOp = IActionOpWithNodeLink;

/**
 * Given an id for the action to, perform the given operation.
 */
export type ActionHandler = (id: IDStr) => ActionOp;

interface IProps {

    /**
     * The trigger characters that have to fire to bring up the dialog.
     */
    readonly trigger: string;

    /**
     * The provider for the commands which we filter for when computing the
     * prompt and then set in the store.
     */
    readonly actionsProvider: ActionMenuItemsProvider;

    /**
     * Execute the action
     */
    readonly onAction: ActionHandler;

    readonly children: JSX.Element;
}

/**
 * Performs teh action DOM mutation based on the type of action.
 */
function useActionExecutor() {

    return React.useCallback((from: INodeOffset, to: INodeOffset, actionOp: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();
            range.setStart(from.node, from.offset);
            range.setEnd(to.node, to.offset);
            return range;
        }

        switch (actionOp.type) {

            case "note-link":

                const coveringRange = createCoveringRange();
                coveringRange.deleteContents();

                const a = document.createElement('a');
                a.setAttribute("href", "#" + actionOp.target);
                a.appendChild(document.createTextNode(actionOp.target));
                coveringRange.insertNode(a);

                window.getSelection()!.getRangeAt(0).setStartAfter(a);
                window.getSelection()!.getRangeAt(0).setEndAfter(a);

                break;

        }

    }, [])

}

// FIXME: what do I do about these edge cases:
//
//     - when we place the mouse manually next to a [[ that's already created in the text
//          - just don't double activate
//     - what happens when we break the text by sticking a [ in it.
//     - what if the link is ALREADY created but we try to change the text under it? how is the link updated?
//           - this is the mian issue because I can abort it but that's it... what I could do is bring up a popup under it
//             to edit it?
//               - I would have to rehydrate the markers...
//     - when we drop the mouse next to the [[ it will create teh ]] automatically and we can get a double effect...
//     - maybe just scan right and don't double create if there are any ]] to the right of the cursor.
//
//     - what happens when I delete the entire region of text that I"m trying to enter? how do I detect that?
//     -

// FIXME how do we replace /execute the action to replace the text? I could use
// the range API for this, replace the text in that range with a document
// fragment then emit the new content as markdown

// - FIXME: Escape should allow using [[ directly and then just abort that input.

// FIXME: now the main issue is I have to patch the DOM and build the
// replacement...
export const NoteAction = observer((props: IProps) => {

    const theme = useTheme();

    const {trigger, actionsProvider, onAction} = props;

    const store = useActionMenuStore();
    const actionExecutor = useActionExecutor();

    // true when the current prompt is active and we're actively selecting or
    // creating a new note by typing in the prompt
    const activeRef = React.useRef(false);

    const textAtTriggerPointRef = React.useRef("");

    const triggerPointNodeOffsetRef = React.useRef<INodeOffset | undefined>(undefined);

    const divRef = useNoteContentEditableElement();

    const reset = React.useCallback(() => {

        activeRef.current = false;
        triggerPointNodeOffsetRef.current = undefined;
        textAtTriggerPointRef.current = '';

        store.setState(undefined);

        return false;

    }, [store])

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (! divRef.current) {
            return false;
        }

        const split = ContentEditables.splitAtCursor(divRef.current)

        if (! split) {
            return false;
        }

        const prefixText = ContentEditables.fragmentToText(split.prefix);

        function hasPrompt(): boolean {
            return prefixText.length >= textAtTriggerPointRef.current.length;
        }

        function computePrompt(): string {
            return prefixText.substr(textAtTriggerPointRef.current.length);
        }

        if (activeRef.current) {

            const prompt = computePrompt();

            if (! hasPrompt()) {
                return reset();
            }

            const items = actionsProvider(prompt);
            store.updateState(items);

        } else {

            if (prefixText.endsWith(trigger)) {

                // FIXME end it with ]]

                // ***
                // - active prompt behavior
                //   - if the cursor leaves the note the action is finished
                //   - what happens if the user types something in the [[ or ]] like changes
                //     the text to something like [a[ ... it should break that text but if they
                //     rejoin it then it should go back to being active.



                // FIXME: what I COULD do is use the splitter code, then compare the prefix and suffix of the note
                // based on the cursor to compute where the cursor is, and then look at where the cursor is in relation
                // to the [[ and ]] to activate/deactivate...

                interface ActivePrompt {

                    /**
                     * The range for where to place the calculate the position for the menu.
                     */
                    readonly positionRange: Range;

                    readonly actionLeft: HTMLSpanElement;

                    readonly actionRight: HTMLSpanElement;

                }

                /**
                 * Create the active input prompt and return a range where the menu must popup.
                 */
                function createActivePrompt(): ActivePrompt {

                    // FIXME: when we wrap it, it resets the cursor
                    //
                    const sel = window.getSelection();

                    // FIXME we will need a canonicalization function to rip the
                    // note-action out.
                    if (sel) {

                        function createBracketSpan(text: string, className: string) {
                            const span = document.createElement('span');
                            span.setAttribute('class', className);
                            span.setAttribute('contenteditable', 'false');
                            span.setAttribute('style', `padding-left: 3px; padding-right: 3px; font-face: fixed; color: ${theme.palette.text.hint};`);
                            span.textContent = text;
                            return span;
                        }

                        function createInputSpan() {
                            const span = document.createElement('span');
                            span.setAttribute('class', 'action-input');
                            return span;
                        }

                        // FIXME: make the brackets a more mild color...

                        // FIXME: deleteContents...

                        const range = sel.getRangeAt(0);

                        const wrapRange = document.createRange();
                        wrapRange.setStart(range.startContainer, range.startOffset - 2);
                        wrapRange.setEnd(range.endContainer, range.endOffset);

                        wrapRange.deleteContents();

                        const actionRight = createBracketSpan(']]', 'action-right');
                        const actionLeft = createBracketSpan('[[', 'action-left');
                        const inputSpan = createInputSpan();

                        wrapRange.insertNode(actionRight);
                        wrapRange.insertNode(inputSpan);
                        wrapRange.insertNode(actionLeft);

                        // FIXME: this iw wrong becuase we're not able to detect
                        // that it's actually one point...

                        // FIXME: this SORT of works but the text goes IN the span... which is a problem.
                        // - Another idea is instead of doing this map the cursor position to where it is in the text
                        //   and then have some tests to detect what action I should perform depending on the text position

                        // FIXME: if the node has NO text, it's not on the screen so the position is invalid...

                        // FIXMEL bnot we're typing in the span
                        range.setStart(inputSpan, 0);
                        range.setEnd(inputSpan, 0);

                        function createPositionRange() {
                            const range = document.createRange();
                            range.setStart(actionLeft.firstChild!, 1);
                            range.setEnd(actionLeft.firstChild!, 1);
                            return range;
                        }

                        const positionRange = createPositionRange();

                        return {
                            positionRange,
                            actionLeft,
                            actionRight
                        }

                    }

                    throw new Error("No selection");

                }

                const activePrompt = createActivePrompt();

                textAtTriggerPointRef.current = prefixText;

                function computeNodeOffsetFromSelection() {
                    const range = document.getSelection()!.getRangeAt(0);
                    return {
                        node: range.startContainer,
                        offset: range.startOffset
                    }
                }

                triggerPointNodeOffsetRef.current = computeNodeOffsetFromSelection();

                const prompt = computePrompt();

                function computePosition() {

                    if (activePrompt.positionRange) {

                        const bcr = activePrompt.positionRange.getBoundingClientRect();

                        const newPosition = {
                            bottom: bcr.top,
                            top: bcr.bottom,
                            left: bcr.left,
                        };

                        if (newPosition.top !== 0 && newPosition.left !== 0) {
                            return newPosition;
                        } else {
                            console.warn("Invalid position ", newPosition);
                        }

                    } else {
                        console.warn("computePosition has no cursor range");
                    }

                    return undefined;

                }

                function createActionHandler() {

                    return (id: IDStr) => {

                        const actionOp = onAction(id);

                        function computeFrom() {
                            return {
                                node: activePrompt.actionLeft,
                                offset: 0
                            };
                        }

                        function computeTo() {
                            return {
                                node: activePrompt.actionRight,
                                offset: 1
                            }
                        }

                        const from = computeFrom();
                        const to = computeTo();

                        actionExecutor(from, to, actionOp);

                        reset();

                    }

                }

                const position = computePosition();
                const actionHandler = createActionHandler();

                if (position) {

                    activeRef.current = true;

                    const actions = actionsProvider(prompt);

                    store.setState({
                        position,
                        actions,
                        onAction: actionHandler
                    });

                } else {
                    console.warn("No position for menu");
                }

            }

        }

        return activeRef.current;

    }, [actionExecutor, actionsProvider, divRef, onAction, reset, store, trigger]);

    return (
        <div onKeyUp={handleKeyUp}>
            {props.children}
        </div>
    );

});
