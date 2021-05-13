import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            fontSize: '18px'
        },
    }),
);

const FixedWidthContainer = React.memo(function FixedWidthContainer(props: {children: JSX.Element}) {

    return (
        <div className="FixedWidthContainer"
             style={{
                 maxWidth: '1000px',
                 flexGrow: 1,
                 marginLeft: 'auto',
                 marginRight: 'auto'
             }}>
            {props.children}
        </div>
    );

});
export const NotesContainer = deepMemo(function NotesContainer(props: {children: JSX.Element})  {

    const classes = useStyles();

    return (
        <div className={clsx(["NotesContainer", classes.root])}>

            <FixedWidthContainer>
                {props.children}
            </FixedWidthContainer>
        </div>
    )

});
