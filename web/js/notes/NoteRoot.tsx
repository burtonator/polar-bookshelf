import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Block } from "./Block";
import { NoteStyle } from "./NoteStyle";
import { BlockIDStr } from "./store/BlocksStore";
import { useBlocksStore } from "./store/BlocksStore";
import { observer } from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import { ActionMenuStoreProvider } from "../mui/action_menu/ActionStore";
import LinearProgress from "@material-ui/core/LinearProgress";
import { autorun } from "mobx";

interface IProps {
    readonly target: BlockIDStr;
}

export const NoteRoot = observer((props: IProps) => {

    // useLifecycleTracer('NoteRoot', {target: props.target});

    const {target} = props;

    const blocksStore = useBlocksStore();

    const block = blocksStore.getBlockByTarget(target)

    React.useEffect(() => {

        // autorun(() => {

            if (block) {
                blocksStore.setRoot(block.id);
                blocksStore.setActive(block.id);
            }
        //
        // });

    }, [block, blocksStore, target])

    if (! blocksStore.hasSnapshot) {
        return (
            <LinearProgress />
        );
    }

    if (! block) {
        return (
            <div>No note for: '{props.target}'</div>
        );
    }

    const id = block?.id;

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{flexGrow: 1}}>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                        <Block parent={undefined} id={id}/>

                        <NotesInbound id={id}/>

                    </MUIBrowserLinkStyle>
                    <ActionMenuPopup/>
                </NoteStyle>
            </NoteSelectionHandler>
        </ActionMenuStoreProvider>
    );

});
