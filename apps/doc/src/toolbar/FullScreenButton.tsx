import * as React from "react";
import {useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import FullscreenIcon from '@material-ui/icons/Fullscreen';

export const FullScreenButton = React.memo(() => {

    const [fullScreen, setFullScreen] = useState(false);

    // TODO: shift+command+f for macos full-screen
    // make this a hook that we can reuse...

    function requestFullScreen() {

        async function doAsync() {

            if (!fullScreen) {
                await document.documentElement.requestFullscreen();
                setFullScreen(true);
            }
        }

        doAsync()
        .catch(err => console.error(err));

    }


    function exitFullScreen() {

        async function doAsync() {

            if (fullScreen) {
                await document.exitFullscreen();
                setFullScreen(false);
            }
        }

        doAsync()
        .catch(err => console.error(err));

    }

    function toggleFullScreen() {
        if (fullScreen) {
            exitFullScreen();
        } else {
            requestFullScreen();
        }
    }

    return (
        <IconButton onClick={toggleFullScreen}>
            <FullscreenIcon/>
        </IconButton>
    )

});
