import * as React from 'react';
import {
    GlobalKeyboardShortcuts,
    keyMapWithGroup
} from "../../../../../web/js/keyboard_shortcuts/GlobalKeyboardShortcuts";
import {useFlashcardCallbacks} from "./FlashcardStore";

const globalKeyMap = keyMapWithGroup({
    group: "Flashcards",
    groupPriority: -1,
    keyMap: {

        SHOW_ANSWER: {
            name: "Show Answer",
            description: "Show answer",
            sequences: [' ', 'Enter']
        },

    }
});

export const FlashcardGlobalHotKeys = React.memo(function FlashcardGlobalHotKeys() {

    const {setSide} = useFlashcardCallbacks();

    const handleShowAnswer = React.useCallback(() => {
        setSide('back');
    }, [setSide]);

    const globalKeyHandlers = {
        SHOW_ANSWER: handleShowAnswer,
    };
    return (
        <GlobalKeyboardShortcuts
            keyMap={globalKeyMap}
            handlerMap={globalKeyHandlers}/>
    );

});


