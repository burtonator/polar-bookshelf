import React from "react";
import {NoteNavigation} from "./NoteNavigation";
import {useLinkLoaderRef} from "../ui/util/LinkLoaderHook";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {MarkdownContentEscaper} from "./MarkdownContentEscaper";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import { observer } from "mobx-react-lite"
import {BlockContentEditable} from "./contenteditable/BlockContentEditable";
import {ContentEditables} from "./ContentEditables";
import { HTMLStr } from "polar-shared/src/util/Strings";
import {BlockPredicates} from "./store/BlockPredicates";
import {MarkdownContent} from "./content/MarkdownContent";

interface ILinkNavigationEvent {
    readonly abortEvent: () => void;
    readonly target: EventTarget | null;
}

function useLinkNavigationEventListener() {

    const linkLoaderRef = useLinkLoaderRef();
    const noteLinkLoader = useNoteLinkLoader();

    return React.useCallback((event: ILinkNavigationEvent): boolean => {

        const {target, abortEvent} = event;

        if (target instanceof HTMLAnchorElement) {

            const href = target.getAttribute('href');

            if (href !== null) {

                if (href.startsWith('#')) {

                    const anchor = Arrays.last(href.split("#"));

                    if (anchor) {
                        noteLinkLoader(anchor);
                        abortEvent();
                        return true;
                    }

                } else {
                    const linkLoader = linkLoaderRef.current;
                    linkLoader(href, {newWindow: true, focus: true});
                    abortEvent();
                    return true;
                }

            }

        }

        return false;

    }, [linkLoaderRef, noteLinkLoader]);

}

function useLinkNavigationClickHandler() {

    const linkNavigationEventListener = useLinkNavigationEventListener();

    return React.useCallback((event: React.MouseEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const target = event.target;

        return linkNavigationEventListener({target, abortEvent});

    }, [linkNavigationEventListener]);

}

const NoteEditorInner = observer(function BlockEditorInner(props: IProps) {

    const {id} = props;
    const blocksStore = useBlocksStore()
    const noteActivated = blocksStore.getBlockActivated(props.id);
    const linkNavigationClickHandler = useLinkNavigationClickHandler();
    const ref = React.createRef<HTMLDivElement | null>();

    const block = blocksStore.getBlock(id);
    const data = blocksStore.getBlockContentData(id);

    const escaper = MarkdownContentEscaper;

    const handleChange = React.useCallback((content: HTMLStr) => {

        const markdown = escaper.unescape(content);

        blocksStore.setBlockContent(id, new MarkdownContent({
            type: 'markdown',
            data: markdown
        }))

    }, [escaper, blocksStore, id]);

    const content = React.useMemo(() => {
        return data !== undefined ? escaper.escape(data) : '';
    }, [data, escaper]);

    const onClick = React.useCallback((event: React.MouseEvent) => {

        if (linkNavigationClickHandler(event)) {
            return;
        }

        blocksStore.setActive(props.id);

    }, [linkNavigationClickHandler, props.id, blocksStore]);

    const handleCreateNewNote = React.useCallback(() => {

        if (ref.current) {

            const split = ContentEditables.splitAtCursor(ref.current);

            if (split) {

                const prefix = escaper.unescape(ContentEditables.fragmentToHTML(split.prefix));
                const suffix = escaper.unescape(ContentEditables.fragmentToHTML(split.suffix));

                blocksStore.createNewBlock(id, {split: {prefix, suffix}});

            }

        }

    }, [escaper, id, ref, blocksStore]);


    const handleEnter = React.useCallback(() => {

        if (ref.current) {
            if (blocksStore.requiredAutoUnIndent(props.id)) {
                blocksStore.unIndentBlock(props.id);
            } else {
                handleCreateNewNote();
            }
        }

    }, [handleCreateNewNote, props.id, ref, blocksStore]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        switch (event.key) {

            case 'Enter':
                handleEnter();
                abortEvent();
                break;

        }

    }, [handleEnter]);

    if (! block) {
        // this can happen when a note is deleted but the component hasn't yet
        // been unmounted.
        return null;
    }

    return (
        <BlockContentEditable id={props.id}
                              parent={props.parent}
                              innerRef={ref}
                              content={content}
                              onChange={handleChange}
                              onClick={onClick}
                              onKeyDown={onKeyDown}/>
    );

});

const NoteEditorWithEditorStore = observer(function NoteEditorWithEditorStore(props: IProps) {

    // useLifecycleTracer('NoteEditorWithEditorStore', {id: props.id});

    return (
        <NoteNavigation parent={props.parent} id={props.id}>
            <NoteEditorInner {...props}/>
        </NoteNavigation>
    );

});

interface IProps {

    readonly parent: BlockIDStr | undefined;

    readonly id: BlockIDStr;

    /**
     * Used when showing content that can't edited so that we get the normal
     * HTML conversion but also link navigation when clicked.
     */
    readonly immutable?: boolean;

}

export const BlockEditor = observer(function BlockEditor(props: IProps) {

    return (
        <NoteEditorWithEditorStore {...props}/>
    );

});
