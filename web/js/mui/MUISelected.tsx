import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {createStyles, fade, makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '&:hover': {
                background: theme.palette.action.hover
            },
            '&$selected, &$selected:hover': {
                backgroundColor: fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
            },
       },
        /* Pseudo-class applied to the root element if `selected={true}`. */
        selected: {},
        /* Pseudo-class applied to the root element if `hover={true}`. */
        hover: {},
    }),
);

interface IProps {
    readonly selected: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}

/**
 * Basic component to set the background color to the selected color.
 *
 * https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js
 */
export const MUISelected = deepMemo((props: IProps) => {

    const classes = useStyles();

    const {selected, className} = props;

    return (
        <div className={clsx(
                 classes.root,
                 {
                    [classes.selected]: selected,
                 },
                 className,
             )}
             style={props.style}>
            {props.children}
        </div>
    );
});
