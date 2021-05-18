import {makeStyles} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import IconButton, {IconButtonProps} from "@material-ui/core/IconButton";
import React from "react";
import clsx from "clsx";

export const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary
        },
    }),
);

export const MUIIconButton: React.FC<IconButtonProps> = React.forwardRef((props, ref) => {
    const classes = useStyles();

    return <IconButton {...props} ref={ref} className={clsx(classes.root, props.className)} />;
});