import * as React from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {ScaleLevel, ScaleLevelTuples} from "../ScaleLevels";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {DocFindButton} from "../DocFindButton";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {useDocViewerCallbacks, useDocViewerStore} from "../DocViewerStore";
import Divider from "@material-ui/core/Divider";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {useDocFindStore} from "../DocFindStore";
import {DocumentWriteStatus} from "../../../../web/js/apps/repository/connectivity/DocumentWriteStatus";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {MUIDocFlagButton} from "../../../repository/js/doc_repo/buttons/MUIDocFlagButton";
import {MUIDocArchiveButton} from "../../../repository/js/doc_repo/buttons/MUIDocArchiveButton";
import {DocViewerToolbarOverflowButton} from "../DocViewerToolbarOverflowButton";
import {MUIDocTagButton} from "../../../repository/js/doc_repo/buttons/MUIDocTagButton";
import {FullScreenButton} from "./FullScreenButton";
import {NumPages} from "./NumPages";
import {PageNumberInput} from "./PageNumberInput";
import {PagePrevButton} from "./PagePrevButton";
import {PageNextButton} from "./PageNextButton";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {DockLayoutToggleButton} from "../../../../web/js/ui/doc_layout/DockLayoutToggleButton";
import {ZenModeActiveContainer} from "../../../../web/js/mui/ZenModeActiveContainer";
import {ZenModeButton} from "./ZenModeButton";
import {MUIPopper, usePopperController} from "../../../../web/js/mui/menu/MUIPopper";
import PaletteIcon from '@material-ui/icons/Palette';
import {Button, ButtonGroup, ClickAwayListener, Grow, Paper, Popper, useTheme} from "@material-ui/core";
import {ResetableColorSelectorBox} from "../../../../web/js/ui/colors/ResetableColorSelectorBox";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ColorSelectorBox, ColorStr} from "../../../../web/js/ui/colors/ColorSelectorBox";
import {ColorMenu, MAIN_HIGHLIGHT_COLORS} from "../../../../web/js/ui/ColorMenu";

const getScaleLevelTuple = (scale: ScaleLevel) => (
    arrayStream(ScaleLevelTuples)
        .filter(current => current.value === scale)
        .first()
);

export const DocViewerToolbar = deepMemo(function DocViewerToolbar() {

    const {docScale, pageNavigator, scaleLeveler, docMeta}
        = useDocViewerStore(['docScale', 'pageNavigator', 'scaleLeveler', 'docMeta']);
    const {finder} = useDocFindStore(['finder']);
    const {setScale, onDocTagged, doZoom, toggleDocArchived, toggleDocFlagged} = useDocViewerCallbacks();

    const handleScaleChange = React.useCallback((scale: ScaleLevel) => {

        setScale(getScaleLevelTuple(scale)!);

    }, [setScale]);

    const zoomValue = React.useMemo(() => {
        if (!docScale || !docScale.scale.value) {
            return 'page-width';
        }
        if (getScaleLevelTuple(docScale.scale.value)) {
            return docScale.scale.value;
        }
        return 'custom';
    }, [docScale]);

    return (
        <ZenModeActiveContainer>
            <MUIPaperToolbar borderBottom>

                <div style={{
                         display: 'flex',
                     }}
                     className="p-1 vertical-aligned-children">

                    <div style={{
                            display: 'flex',
                            flexGrow: 1,
                            flexBasis: 0
                         }}
                         className="vertical-aligned-children">

                        <MUIButtonBar>

                            <DockLayoutToggleButton side='left' size="small"/>

                            {finder && (
                                <>
                                    <DocFindButton className="mr-1"/>
                                    <Divider orientation="vertical" flexItem={true}/>
                                </>
                            )}

                            <PagePrevButton/>

                            <PageNextButton/>

                            {pageNavigator && (
                                <>
                                    <PageNumberInput nrPages={pageNavigator.count}/>
                                    <NumPages nrPages={pageNavigator.count}/>
                                </>
                            )}

                        </MUIButtonBar>
                    </div>

                    <div style={{
                             display: 'flex',
                             flexGrow: 1,
                             flexBasis: 0
                         }}
                         className="vertical-align-children">

                        <div style={{
                                 display: 'flex',
                                 alignItems: 'center'
                             }}
                             className="ml-auto mr-auto vertical-align-children">

                             {docScale && scaleLeveler && (
                                <DeviceRouters.Desktop>
                                    <MUIButtonBar>
                                        <IconButton size="small" onClick={() => doZoom('-')}>
                                            <RemoveIcon/>
                                        </IconButton>

                                            <FormControl variant="outlined" size="small">
                                                <Select value={zoomValue}
                                                        onChange={event => handleScaleChange(event.target.value as ScaleLevel)}>
                                                    {zoomValue === "custom" &&
                                                        <MenuItem disabled value="custom">
                                                            {(+docScale.scale.value * 100).toFixed(2)}%
                                                            &nbsp;(Custom)
                                                        </MenuItem>
                                                    }
                                                    {ScaleLevelTuples.map(current => (
                                                        <MenuItem key={current.value}
                                                                  value={current.value}>
                                                            {current.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                        <IconButton size="small"  onClick={() => doZoom('+')}>
                                            <AddIcon/>
                                        </IconButton>

                                    </MUIButtonBar>
                                </DeviceRouters.Desktop>
                            )}

                        </div>

                    </div>

                    <div style={{
                             display: 'flex',
                             flexGrow: 1,
                             flexBasis: 0
                         }}
                         className="vertical-aligned-children">

                        <div style={{display: 'flex'}}
                             className="ml-auto vertical-aligned-children">

                            <MUIButtonBar>

                                <TextHighlightTrigger />

                                {/* TODO: implement keyboard shortcuts for these. */}
                                <MUIDocTagButton size="small"
                                                 onClick={onDocTagged}/>

                                <MUIDocArchiveButton size="small"
                                                     onClick={toggleDocArchived}
                                                     active={docMeta?.docInfo?.archived}/>

                                <MUIDocFlagButton size="small"
                                                  onClick={toggleDocFlagged}
                                                  active={docMeta?.docInfo?.flagged}/>

                                <Divider orientation="vertical" flexItem={true}/>

                                {/*
                                <div className="ml-3 mr-2" style={{display: 'flex'}}>
                                    <DocumentWriteStatus/>
                                </div>
                                */}

                                <ZenModeButton/>

                                <FullScreenButton/>

                                <DocViewerToolbarOverflowButton docInfo={docMeta?.docInfo}/>

                                <DockLayoutToggleButton side='right' size="small"/>

                            </MUIButtonBar>
                        </div>

                    </div>

                </div>
            </MUIPaperToolbar>
        </ZenModeActiveContainer>
    );
});

interface IProps {

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly size?: string;

    readonly color?: 'primary' | 'secondary';

    readonly onSelected?: (selected?: ColorStr) => void;

    readonly selected?: ColorStr;

}

const TextHighlightTrigger: React.FC = () => {
    const theme = useTheme();

    const {textHighlightColor} = useDocViewerStore(['textHighlightColor']);
    const {setTextHighlightColor} = useDocViewerCallbacks();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState<ColorStr>(MAIN_HIGHLIGHT_COLORS[0]);
    const active = textHighlightColor;


    const handleColorChange = (color: ColorStr) => {
        setOpen(false);
        setTextHighlightColor(color);
        setSelectedColor(color);
    };

    const handleClick = () => {
        if (active) {
            setTextHighlightColor(null);
        } else {
            setTextHighlightColor(selectedColor);
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
        const anchor = anchorRef.current;
        if (anchor && anchor.contains(event.target as HTMLElement)) {
          return;
        }

        setOpen(false);
    };


    return (
        <div>
            <ButtonGroup
                variant={active ? "contained" : "outlined" }
                color={active ? "primary" : undefined}
                ref={anchorRef}
                disableElevation
            >
                <Button onClick={handleClick}>
                    <PaletteIcon style={{ fill: selectedColor }} />
                </Button>
                <Button
                  color="primary"
                  size="small"
                  onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="top-end"
                style={{ zIndex: theme.zIndex.modal }}
                transition
                disablePortal
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: "center top" }}
                    >
                        <Paper style={{ background: theme.palette.background.paper }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <ColorMenu onChange={handleColorChange} selected={selectedColor} />
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
};
