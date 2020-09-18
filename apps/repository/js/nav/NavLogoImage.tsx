import * as React from 'react';
import {PolarSVGIcon} from "../../../../web/js/ui/svg_icons/PolarSVGIcon";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly width?: number;
    readonly height?: number;
}

export const NavLogoImage = deepMemo((props: IProps) => {

    const width = props.width || 35;
    const height = props.height || 35;

    return (
        <PolarSVGIcon width={width} height={height}/>
    );

});

