import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import LinearProgress from '@material-ui/core/LinearProgress';
import {LinearProgressWithLabel} from './LinearProgressWithLabel';
import { MUIDialog } from './MUIDialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        dialogContent: {
            paddingTop: '20px',
            paddingBottom: '20px'
        },
        title: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
        },

        description: {
            fontSize: '1.00rem',
            color: theme.palette.text.secondary,
            paddingTop: '15px',
            paddingBottom: '15px'
        },

        progressArea: {
            paddingTop: '15px',
            paddingBottom: '5px',
        }

    }),
);

export interface ProgressDialogProps {
    readonly title: string;
    readonly description: string;
    readonly value: Percentage | 'indeterminate';
    readonly icon?: JSX.Element;
}

export const ProgressDialog = (props: ProgressDialogProps) => {

    const classes = useStyles();

    const open = props.value !== 100;

    return (

        <MUIDialog open={open}>

            <div className={classes.root}>
                <DialogContent className={classes.dialogContent}>

                    <div style={{
                             display: 'flex',
                             flexWrap: 'nowrap',
                             alignItems: 'center'
                         }}>

                        {props.icon && (
                            <div style={{paddingRight: '25px'}}>
                                {props.icon}
                            </div>)}

                        <div style={{flexGrow: 1}}>
                            <div id="form-dialog-title" className={classes.title}>{props.title}</div>

                            <div className={classes.description}>

                                <div>
                                    {props.description}
                                </div>

                            </div>

                            <div className={classes.progressArea}>

                                {props.value === 'indeterminate' &&
                                    <LinearProgress variant="indeterminate" />}

                                {props.value !== 'indeterminate' &&
                                    <LinearProgressWithLabel variant="determinate" value={props.value}/>}

                            </div>

                        </div>
                    </div>
                </DialogContent>

            </div>

        </MUIDialog>
    );
};
