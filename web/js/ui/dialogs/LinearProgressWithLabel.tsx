import React from 'react';
import LinearProgress, {LinearProgressProps} from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {deepMemo} from "../../react/ReactUtils";

export const LinearProgressWithLabel = deepMemo((props: LinearProgressProps & { value: number }) => {

    const rounded = Math.round(props.value);

    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary"
                            style={{fontSize: '13px'}}>{`${rounded}%`}</Typography>
            </Box>
        </Box>
    );
});
