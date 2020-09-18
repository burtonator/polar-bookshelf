import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons/faCheckSquare";
import {faCoffee} from "@fortawesome/free-solid-svg-icons/faCoffee";
import {faTag} from "@fortawesome/free-solid-svg-icons/faTag";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import {faSquare} from "@fortawesome/free-regular-svg-icons/faSquare";
import {faChrome} from "@fortawesome/free-brands-svg-icons/faChrome";
import {faDiscord} from "@fortawesome/free-brands-svg-icons/faDiscord";
import {faDatabase} from "@fortawesome/free-solid-svg-icons/faDatabase";

import {IconProp, library} from "@fortawesome/fontawesome-svg-core";
import {deepMemo} from "../react/ReactUtils";

library.add(faCheckSquare, faCoffee, faTag, faPlus, faCheckSquare, faDatabase, faTimesCircle, faSquare, faChrome, faDiscord);

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
export const FATagIcon = createIcon(faTag);
export const FAPlusIcon = createIcon(faPlus);
export const FACheckCircleIcon = createIcon(faCheckCircle);
export const FATimesCircleIcon = createIcon(faTimesCircle);
export const FADatabaseIcon = createIcon(faDatabase);
