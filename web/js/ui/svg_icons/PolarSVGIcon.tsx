import * as React from 'react';

import RESOURCE from 'polar-assets/src/assets/logo/icon.svg';

interface IProps {
    readonly className?: string;
    readonly width: number;
    readonly height: number;
}

// TODO: if we embed how do we specify the width and height
export const PolarSVGIcon = React.memo((props: IProps) => (
    <img src={RESOURCE}
         width={props.width}
         height={props.height}
         className={props.className}
         alt="Polar Logo"/>
));


