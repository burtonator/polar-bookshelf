import * as React from 'react';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly width?: number;
    readonly height?: number;
}

<<<<<<< HEAD
=======
// TODO: take a base URL to load it via a different strategy for use with the
// chrome extension.
>>>>>>> 373f4a844cb6f5f4fb4e0d18c58b58729b9cb9b5
export const NavLogoImage = deepMemo((props: IProps) => {

    const width = props.width || 35;
    const height = props.height || 35;

    return (
        <PolarSVGIcon width={width} height={height}/>
    );

});

