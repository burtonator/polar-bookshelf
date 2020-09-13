import * as React from "react";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {PDFScales, ScaleLevel, ScaleLevelTuples} from "../ScaleLevels";
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
import {MUIDocFlagButton} from "../../../repository/js/doc_repo/buttons/MUIDocFlagButton";
import {MUIDocArchiveButton} from "../../../repository/js/doc_repo/buttons/MUIDocArchiveButton";
import {DocViewerToolbarOverflowButton} from "../DocViewerToolbarOverflowButton";
import {MUIDocTagButton} from "../../../repository/js/doc_repo/buttons/MUIDocTagButton";
import {FullScreenButton} from "./FullScreenButton";
import {NumPages} from "./NumPages";
import {PageNumberInput} from "./PageNumberInput";
import {PagePrevButton} from "./PagePrevButton";
import {PageNextButton} from "./PageNextButton";
import {useLogWhenChanged} from "../../../../web/js/hooks/ReactHooks";
import computeNextZoomLevel = PDFScales.computeNextZoomLevel;
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export const DocViewerToolbar = deepMemo(() => {

    const {docScale, pageNavigator, scaleLeveler, docMeta}
        = useDocViewerStore(['docScale', 'pageNavigator', 'scaleLeveler', 'docMeta']);
    const {finder} = useDocFindStore(['finder']);
    const {setScale, setDocFlagged, setDocArchived, onDocTagged} = useDocViewerCallbacks();

    const handleScaleChange = (scale: ScaleLevel) => {

        const value =
            arrayStream(ScaleLevelTuples)
                .filter(current => current.value === scale)
                .first();

        setScale(value!);

    };

    const handleNextZoomLevel = (delta: number) => {

        const nextScale = computeNextZoomLevel(delta, docScale?.scale);

        if (nextScale) {
            setScale(nextScale);
        }

    };

    return (
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
                                    <IconButton onClick={() => handleNextZoomLevel(-1)}>
                                        <RemoveIcon/>
                                    </IconButton>

                                        <FormControl variant="outlined" size="small">
                                            <Select value={docScale.scale.value || 'page-width'}
                                                    onChange={event => handleScaleChange(event.target.value as ScaleLevel)}>
                                                {ScaleLevelTuples.map(current => (
                                                    <MenuItem key={current.value}
                                                              value={current.value}>
                                                        {current.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    <IconButton onClick={() => handleNextZoomLevel(1)}>
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

                            <MUIDocTagButton size="medium"
                                             onClick={onDocTagged}/>

                            <MUIDocArchiveButton size="medium"
                                                 onClick={() => setDocArchived(! docMeta?.docInfo?.archived)}
                                                 active={docMeta?.docInfo?.archived}/>

                            <MUIDocFlagButton size="medium"
                                              onClick={() => setDocFlagged(! docMeta?.docInfo?.flagged)}
                                              active={docMeta?.docInfo?.flagged}/>

                            <Divider orientation="vertical" flexItem={true}/>

                            <div className="ml-3 mr-2" style={{display: 'flex'}}>
                                <DocumentWriteStatus/>
                            </div>

                            <FullScreenButton/>

                            <DocViewerToolbarOverflowButton docInfo={docMeta?.docInfo}/>

                        </MUIButtonBar>
                    </div>

                </div>

            </div>
        </MUIPaperToolbar>
    );
});

