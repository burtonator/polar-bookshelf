import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import isEqual from "react-fast-compare";
import {FACheckSquareIcon, FASquareIcon} from "../../../../web/js/mui/MUIFontAwesome";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        active: {
            color: theme.palette.secondary.main
        },
        inactive: {
            color: theme.palette.text.secondary,
            // color: theme.palette.secondary.main
        }
    }),
);


interface IProps {
    readonly checked: boolean;
}

export const MUIEfficientCheckbox = React.memo((props: IProps) => {

    const classes = useStyles();

    if (props.checked) {
        return (
            <FACheckSquareIcon className={props.checked ? classes.active : classes.inactive}
                               style={{
                               fontSize: '1.2em',
                               margin: '2px'
                           }}
                           />
        )
    } else {
        return (
            <FASquareIcon className={props.checked ? classes.active : classes.inactive}
                          style={{
                          fontSize: '1.2em',
                          margin: '2px'
                      }}
                      />
        )

    }

}, isEqual);
