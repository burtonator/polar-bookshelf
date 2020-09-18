import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons/faCheckSquare";
import {faCoffee} from "@fortawesome/free-solid-svg-icons/faCoffee";
import {faTag} from "@fortawesome/free-solid-svg-icons/faTag";
import {faSquare} from "@fortawesome/free-regular-svg-icons/faSquare";
import {faChrome} from "@fortawesome/free-brands-svg-icons/faChrome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";

import {IconProp, library} from "@fortawesome/fontawesome-svg-core";
import {deepMemo} from "../react/ReactUtils";

library.add(faCheckSquare, faCoffee, faTag, faCheckSquare, faSquare, faChrome, faDiscord);

// to minimize size we have to:
// https://github.com/FortAwesome/react-fontawesome/issues/70

interface FASvgIconProps extends SvgIconProps {
    readonly icon: IconProp;
}

const FASvgIcon = deepMemo((props: FASvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <FontAwesomeIcon icon={props.icon} />
        </SvgIcon>
    );
});

function createIcon(icon: IconProp) {
    return deepMemo((props: SvgIconProps) => (
        <FASvgIcon icon={icon} {...props}/>
    ))
}

export const FACheckSquareIcon = createIcon(faCheckSquare);
export const FASquareIcon = createIcon(faSquare);
export const FAChromeIcon = createIcon(faChrome);
export const FADiscordIcon = createIcon(faDiscord);
