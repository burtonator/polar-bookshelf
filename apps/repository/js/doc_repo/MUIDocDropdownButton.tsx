import React from "react";
import {MUIDocDropdownMenu} from "./MUIDocDropdownMenu";
import IconButton from "@material-ui/core/IconButton";
import grey from "@material-ui/core/colors/grey";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Callback1} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

interface IProps {
    readonly onClick: Callback1<React.MouseEvent>;
}

interface IState {
    readonly anchorEl: HTMLElement | null;
}

export const MUIDocDropdownButton = deepMemo((props: IProps) => {

    const [state, setState] = React.useState<IState>({anchorEl: null});

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {

        props.onClick(event);

        setState({
            anchorEl: event.currentTarget
        });

    };

    const handleClose = () => {
        setState({
            anchorEl: null
        });
    };

    const {anchorEl} = state;

    return (
        <div>

            <IconButton
                aria-controls="doc-dropdown-menu"
                aria-haspopup="true"
                // variant="contained"
                color="default"
                onClick={handleClick}
                size="small"
                style={{color: grey[500]}}>
                <MoreVertIcon/>
            </IconButton>
            {anchorEl &&
                <MUIDocDropdownMenu anchorEl={anchorEl}
                                    onClose={handleClose}/>}
        </div>
    );

});
