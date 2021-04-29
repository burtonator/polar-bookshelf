import {createStyles, makeStyles, MenuItem, MenuList} from "@material-ui/core";
import React from "react";
import {ColorStr} from "./colors/ColorSelectorBox";
import PaletteIcon from "@material-ui/icons/Palette";

export const MAIN_HIGHLIGHT_COLORS: ReadonlyArray<ColorStr> = [
    "#ff0000",
    "#00ff00",
    "#9900ef",
    "ff6900",
    "#ffff00",
];

const useStyles = makeStyles(() =>
    createStyles({
        menuItemGutters: {
            paddingLeft: 14,
            paddingRight: 14,
        }
    }),
);

type IColorMenuProps = {
    selected?: ColorStr;
    onChange: (color: ColorStr) => void;
};

export const ColorMenu= React.forwardRef<HTMLUListElement, IColorMenuProps>(({ selected, onChange }, ref) => {
    const classes = useStyles();

    return (
        <MenuList ref={ref}>
            {MAIN_HIGHLIGHT_COLORS.map(color => (
                <MenuItem
                    key={color}
                    classes={{ gutters: classes.menuItemGutters }}
                    selected={selected === color}
                    onClick={() => onChange(color)}
                >
                    { <PaletteIcon style={{ color }} /> }
                </MenuItem>
            ))}
        </MenuList>
    );
});
