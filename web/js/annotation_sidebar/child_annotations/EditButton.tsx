import * as React from 'react';
import {Analytics} from "../../analytics/Analytics";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {deepMemo} from "../../react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly id: string;
    readonly onClick: () => void;
    readonly type: 'comment' | 'flashcard';
    readonly disabled?: boolean;
}

export const EditButton = deepMemo((props: IProps) => {

    const theme = useTheme();

    function onClick() {
        Analytics.event({category: 'annotation-edit', action: props.type});
        props.onClick();
    }

    return (
        <IconButton id={props.id}
                    size="small"
                    style={{color: theme.palette.text.secondary}}
                    disabled={props.disabled}
                    title={'Edit ' + props.type}
                    onClick={() => onClick()}>

            <EditIcon/>

        </IconButton>
    );

});

