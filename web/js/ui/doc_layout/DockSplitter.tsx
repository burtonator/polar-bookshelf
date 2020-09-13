import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';

interface IProps {
    readonly onMouseDown: () => void;
}

export const DockSplitter = deepMemo((props: IProps) => {

    const theme = useTheme();
    const [active, setActive] = React.useState(false);

    const createSplitterStyle = () => {

        const result: React.CSSProperties = {
            width: '4px',
            minWidth: '4px',
            maxWidth: '4px',
            cursor: 'col-resize',
            // backgroundColor: active ?
            //     // TODO darken doesn't work but both paper and default are white
            //     // on light mode
            //     theme.palette.background.default :
            //     theme.palette.background.paper,
            // backgroundColor: grey[500],
            backgroundColor: 'var(--grey500)',
            minHeight: 0
        };

        return result;

    };

    const splitterStyle = createSplitterStyle();

    return (
        <div draggable={false}
             onMouseDown={() => props.onMouseDown()}
             // onMouseOver={() => setActive(true)}
             // onMouseOut={() => setActive(false)}
             style={splitterStyle}>

        </div>
    );
})
