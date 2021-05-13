import React from "react";
import PhotoSizeSelectLargeIcon from '@material-ui/icons/PhotoSizeSelectLarge';
import { ToggleButtonProps, StandardToggleButton } from "./StandardToggleButton";

export const MUIDocAreaHighlightModeToggle = React.memo((props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Area highlight mode" {...props}>
        <PhotoSizeSelectLargeIcon/>
    </StandardToggleButton>
));
