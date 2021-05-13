import React from 'react';
import {IDStr, MarkdownStr} from "polar-shared/src/util/Strings";
import useTheme from '@material-ui/core/styles/useTheme';
import {ActionMenuItemsProvider, useActionMenuStore} from "../../mui/action_menu/ActionStore";
import {ContentEditables} from "../ContentEditables";
import INodeOffset = ContentEditables.INodeOffset;
import {useBlockContentEditableElement} from "./BlockContentEditable";
import { observer } from "mobx-react-lite"
import {BlockIDStr, useBlocksStore} from '../store/BlocksStore';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {MarkdownContentEscaper} from "../MarkdownContentEscaper";

const THINSP = ' ';

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
export interface IActionOpWithBlockLink {
    readonly type: 'link-to-block';
    readonly target: string;
    readonly undoContent: MarkdownStr;
}

export type ActionOp = IActionOpWithBlockLink;

export interface IActionTypeWithBlockLink {
    readonly type: 'link-to-block';
    readonly target: string;
}

export type ActionType = IActionTypeWithBlockLink;

/**
 * Given an id for the action to, perform the given operation.
 */
export type ActionHandler = (id: IDStr) => ActionType;

interface IProps {

    readonly id: BlockIDStr;

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
function useActionExecutor(id: BlockIDStr) {

    const blocksStore = useBlocksStore();

    const contentEditableMarkdownReader = useContentEditableMarkdownReader();

    return React.useCallback((from: INodeOffset, to: INodeOffset, actionOp: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();

            // TODO technically we don't need the offset here.
            range.setStartBefore(from.node);
            range.setEndAfter(to.node);

            return range;
        }

        switch (actionOp.type) {

            case "link-to-block":

                const updateSelection = () => {

                    const coveringRange = createCoveringRange();
                    coveringRange.deleteContents();

                    const a = document.createElement('a');
                    a.setAttribute("href", "#" + actionOp.target);
                    a.appendChild(document.createTextNode(actionOp.target));
                    coveringRange.insertNode(a);

                    window.getSelection()!.getRangeAt(0).setStartAfter(a);
                    window.getSelection()!.getRangeAt(0).setEndAfter(a);

                }

                updateSelection();

                const content = contentEditableMarkdownReader();
                blocksStore.createLinkToBlock(id, actionOp.target, actionOp.undoContent, content);
                break;

        }

    }, [contentEditableMarkdownReader, blocksStore, id])

}

function useContentEditableMarkdownReader() {

    const divRef = useBlockContentEditableElement();

    return React.useCallback(() => {

        const escaper = MarkdownContentEscaper;
        const div = divRef.current!.cloneNode(true) as HTMLElement;
        const html = div.innerHTML;
        return escaper.unescape(html);

    }, [divRef]);

}

/**
 * Represents a prompt range with two spans for left and right and an input in the middle.
 */
interface ActivePrompt {

    /**
     * The range for where to place the calculate the position for the menu.
     */
    readonly positionRange: Range;

    readonly actionInput: HTMLSpanElement;

}

export const BlockAction = observer((props: IProps) => {

    const theme = useTheme();

    const {trigger, actionsProvider, onAction} = props;

    const actionStore = useActionMenuStore();
    const actionExecutor = useActionExecutor(props.id);

    // true when the current prompt is active and we're actively selecting or
    // creating a new note by typing in the prompt
    const activeRef = React.useRef(false);

    const initialMarkdownContentRef = React.useRef('');

    const divRef = useBlockContentEditableElement();

    const activePromptRef = React.useRef<ActivePrompt | undefined>(undefined);

    const computeItems = React.useCallback((prompt: string) => {

        return [...(prompt.length === 0 ? [] : actionsProvider(prompt))]
               .sort((a, b) => a.text.localeCompare(b.text))

    }, [actionsProvider])


    const computeActionInputText = React.useCallback((): string => {

        return (activePromptRef.current?.actionInput.textContent || '')
            .replace(/^\[\[./, '')
            .replace(/.\]\]$/, '');

    }, []);

    const clearActivePrompt = React.useCallback((noRange?: boolean) => {

        if (! activePromptRef.current) {
            return;
        }

        const actionInput = activePromptRef.current.actionInput;

        if (actionInput.parentElement) {

            const prompt = computeActionInputText();

            const newPromptText = prompt !== '' ? prompt : '[[';

            // **** replace the range of teh actionInput element so that it's not part of the DOM

            const replaceRange = document.createRange();
            replaceRange.setStartBefore(actionInput);
            replaceRange.setEndAfter(actionInput);

            replaceRange.deleteContents();
            replaceRange.insertNode(document.createTextNode(newPromptText));

            if (! noRange) {

                // **** now use the last char of the replace range as the main range.
                const range = window.getSelection()!.getRangeAt(0);
                range.setStart(replaceRange.endContainer, replaceRange.endOffset);
                range.setEnd(replaceRange.endContainer, replaceRange.endOffset);

            }

        }

    }, [computeActionInputText]);

    const cursorWithinInput = React.useCallback((delta: number = 0): boolean => {

        if (! divRef.current) {
            return false;
        }

        if (!activePromptRef.current) {
            return false;
        }

        function createInputRange() {

            const inputEnd = ContentEditables.computeEndNodeOffset(activePromptRef.current!.actionInput);

            const inputRange = document.createRange();

            inputRange.setStart(activePromptRef.current!.actionInput.firstChild!, 3);
            inputRange.setEnd(inputEnd.node, inputEnd.offset - 3);

            return inputRange;

        }

        const inputRange = createInputRange();

        const range = window.getSelection()!.getRangeAt(0);

        return inputRange.isPointInRange(range.startContainer, range.startOffset + delta) &&
               inputRange.isPointInRange(range.endContainer, range.endOffset + delta);

    }, [divRef]);

    const createActionRangeForHandler = React.useCallback(() => {

        function computeFrom() {
            return {
                node: activePromptRef.current!.actionInput,
                offset: 0
            };
        }

        function computeTo() {
            return {
                node: activePromptRef.current!.actionInput,
                offset: (activePromptRef.current!.actionInput.textContent || '').length
            }
        }

        const from = computeFrom();
        const to = computeTo();

        return {from, to};

    }, []);

    const doReset = React.useCallback((noRange?: boolean) => {

        if (activeRef.current) {

            clearActivePrompt(noRange);

            activeRef.current = false;

            activePromptRef.current = undefined;

            actionStore.setState(undefined);

        }

    }, [clearActivePrompt, actionStore])

    const captureInitialMarkdownContent = React.useCallback(() => {

        const escaper = MarkdownContentEscaper;
        const div = divRef.current!.cloneNode(true) as HTMLElement;
        div.querySelector('.action-input')!.outerHTML = '';
        const html = div.innerHTML;
        return escaper.unescape(html);

    }, [divRef]);

    const doComplete = React.useCallback(() => {

        const prompt = computeActionInputText();

        const {from, to} = createActionRangeForHandler()

        const undoContent = initialMarkdownContentRef.current!;

        actionExecutor(from, to, {
            type: 'link-to-block',
            target: prompt,
            undoContent
        });

        doReset();

    }, [actionExecutor, computeActionInputText, createActionRangeForHandler, doReset]);

    const doCompleteOrReset = React.useCallback(() => {

        const prompt = computeActionInputText();

        if (prompt.length !== 0) {
            doComplete();
        } else {
            doReset();
        }

    }, [computeActionInputText, doComplete, doReset]);

    const hasAborted = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (! activePromptRef.current) {
            return true;
        }

        if (! activePromptRef.current.actionInput.parentElement) {
            return true;
        }

        const actionText = activePromptRef.current.actionInput.textContent || '';

        if (! actionText.startsWith(`[[${THINSP}`)) {
            console.log("Aborted: left");
            return true;
        }

        if (! actionText.endsWith(`${THINSP}]]`)) {
            console.log("Aborted: right");
            return true;
        }

        return false;

    }, []);

    const createActionHandler = React.useCallback(() => {

        return (id: IDStr) => {

            const actionType = onAction(id);

            const {from, to} = createActionRangeForHandler()

            const undoContent = initialMarkdownContentRef.current!;

            const actionOp = {
                ...actionType,
                undoContent
            };

            actionExecutor(from, to, actionOp);

            doReset();

        }

    }, [onAction, createActionRangeForHandler, actionExecutor, doReset]);

    /**
     * Create the active input prompt and return a range where the menu must popup.
     */
    const createActivePrompt = React.useCallback((): ActivePrompt => {

        const sel = window.getSelection();

        if (sel) {

            function createBracketSpan(text: string, className: string) {
                const span = document.createElement('span');
                span.setAttribute('class', className);
                span.setAttribute('style', `color: ${theme.palette.text.hint};`);

                const textNode = document.createTextNode(text);
                span.appendChild(textNode);
                return span;
            }

            function createInputSpan() {

                const span = document.createElement('span');
                span.setAttribute('class', 'action-input');

                const textNode = document.createTextNode(`[[${THINSP}${THINSP}]]`);
                span.appendChild(textNode);

                return span;
            }

            const range = sel.getRangeAt(0);

            const wrapRange = document.createRange();
            wrapRange.setStart(range.startContainer, range.startOffset - 2);
            wrapRange.setEnd(range.endContainer, range.endOffset);

            wrapRange.deleteContents();

            const actionInput = createInputSpan();

            wrapRange.insertNode(actionInput);

            range.setStart(actionInput.firstChild!, 3);
            range.setEnd(actionInput.firstChild!, 3);

            function createPositionRange() {
                const range = document.createRange();
                range.setStart(actionInput.firstChild!, 3);
                range.setEnd(actionInput.firstChild!, 3);
                return range;
            }

            const positionRange = createPositionRange();

            return {
                positionRange,
                actionInput
            }

        }

        throw new Error("No selection");

    }, [theme.palette.text.hint]);

    const computePosition = React.useCallback(() => {

        if (activePromptRef.current?.positionRange) {

            const bcr = activePromptRef.current.positionRange.getBoundingClientRect();

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

    }, []);

    /**
     * This has to be called twice. One on onKeyDown and one on onKeyUp because
     * React (for some reason) is not reliably calling onKeyDown with Escape
     * with an empty prompt.
     */
    const doResetWithKeyboardEvent = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (activeRef.current) {

            switch (event.key) {

                case 'Escape':
                    doReset();
                    return true;

            }

        }

        return false;

    }, [doReset]);

    const doCompleteOrResetWithKeyboardEvent = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (activeRef.current) {

            switch (event.key) {

                case 'Tab':
                case 'Enter':

                    doCompleteOrReset();

                    event.stopPropagation();
                    event.preventDefault();

                    return true;

            }

        }

        return false;

    }, [doCompleteOrReset]);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (activeRef.current) {

            if (doResetWithKeyboardEvent(event)) {
                return;
            }

            if (doCompleteOrResetWithKeyboardEvent(event)) {
                return;
            }

            function computeDelta(): number {

                switch (event.key) {

                    case 'ArrowLeft':
                        return -1;

                    case 'Backspace':
                        return -1;

                    case 'ArrowRight':
                        return 1;

                    default:
                        return 0;

                }

            }

            const delta = computeDelta();

            if (delta !== 0 && ! cursorWithinInput(delta)) {

                doCompleteOrReset();

                switch (event.key) {

                    case 'ArrowLeft':
                    case 'Backspace':
                        event.stopPropagation();
                        event.preventDefault();
                        break;

                }

                return;

            }

        }

    }, [cursorWithinInput, doCompleteOrReset, doCompleteOrResetWithKeyboardEvent, doResetWithKeyboardEvent]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (! divRef.current) {
            return;
        }

        const split = ContentEditables.splitAtCursor(divRef.current)

        if (! split) {
            return;
        }

        const prefixText = ContentEditables.fragmentToText(split.prefix);

        function computeActionInputText(): string {

            return (activePromptRef.current?.actionInput.textContent || '')
                .replace(/^\[\[./, '')
                .replace(/.\]\]$/, '');

        }

        if (activeRef.current) {

            if (doResetWithKeyboardEvent(event)) {
                return;
            }

            if (doCompleteOrResetWithKeyboardEvent(event)) {
                return;
            }

            const prompt = computeActionInputText();

            if (hasAborted(event)) {
                doReset();
                return;
            }

            const items = computeItems(prompt);
            actionStore.updateState(items);

        } else {

            if (prefixText.endsWith(trigger) && event.key === '[') {

                activePromptRef.current = createActivePrompt();

                const prompt = computeActionInputText();

                const position = computePosition();
                const actionHandler = createActionHandler();

                if (position) {

                    activeRef.current = true;

                    initialMarkdownContentRef.current = captureInitialMarkdownContent();

                    const items = computeItems(prompt);

                    actionStore.setState({
                        position,
                        items,
                        onAction: actionHandler
                    });

                } else {
                    console.warn("No position for menu");
                }

            }

        }

        return activeRef.current;

    }, [divRef, doResetWithKeyboardEvent, doCompleteOrResetWithKeyboardEvent, hasAborted, computeItems,
        actionStore, doReset, trigger, createActivePrompt, computePosition, createActionHandler,
        captureInitialMarkdownContent]);

    const handleClick = React.useCallback(() => {

        doCompleteOrReset();

    }, [doCompleteOrReset]);

    return (
        <ClickAwayListener onClickAway={() => doReset(true)}>
            <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onClick={handleClick}>
                {props.children}
            </div>
        </ClickAwayListener>
    );

});

