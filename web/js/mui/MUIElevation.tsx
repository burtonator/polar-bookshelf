import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {useTheme} from "@material-ui/core/styles";
import grey from '@material-ui/core/colors/grey'

export type Elevation = 1 | 2 | 3 | 4;

function useElevationBackground(elevation: Elevation) {

    // this would be better as a CSS style.

    const theme = useTheme();

    if (theme.palette.type === 'dark') {

        switch(elevation) {

            case 1:
                return grey[800];
            case 2:
                return grey[700];
            case 3:
                return grey[600];
            case 4:
                return grey[500];

        }

    } else {

        switch(elevation) {

            case 1:
                return grey[300];
            case 2:
                return grey[400];
            case 3:
                return grey[500];
            case 4:
                return grey[600];

        }

    }

}

interface IProps {
    readonly elevation: Elevation;
    readonly children: React.ReactElement;
}

/**
 * Basic component to set the background color to the selected color.
 *
 * https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js
 */
export const MUIElevation = deepMemo((props: IProps) => {
    const background = useElevationBackground(props.elevation);

    return (
        <div style={{background}}>
            {props.children}
        </div>
    );
});
