import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MUIMenu} from "../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../web/js/mui/menu/MUIMenuItem";
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {useLinkLoader} from "../../../web/js/ui/util/LinkLoaderHook";
import {Clipboards} from "../../../web/js/util/system/clipboard/Clipboards";
import {SIDE_NAV_ENABLED, useSideNavCallbacks} from "../../../web/js/sidenav/SideNavStore";
import Divider from '@material-ui/core/Divider';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import LinkIcon from '@material-ui/icons/Link';
import CloseIcon from '@material-ui/icons/Close';
import {useDialogManager} from "../../../web/js/mui/dialogs/MUIDialogControllers";
import { useDocViewerCallbacks, useDocViewerStore } from './DocViewerStore';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import {ISelectOption} from "../../../web/js/ui/dialogs/SelectDialog";
import {Arrays} from "polar-shared/src/util/Arrays";
import {useDocViewerToolbarStyles} from './toolbar/DocViewerToolbar';

interface IProps {
    readonly docInfo: IDocInfo | undefined;
}


function useSetColumnLayoutCallback() {

    const dialogs = useDialogManager();

    const {docMeta} = useDocViewerStore(['docMeta']);

    const {setColumnLayout} = useDocViewerCallbacks();

    const options: ReadonlyArray<ISelectOption<number>> = React.useMemo(() => [
        {
            id: "1",
            label: "1",
            value: 1
        },
        {
            id: "2",
            label: "2",
            value: 2
        },
        {
            id: "3",
            label: "3",
            value: 3
        }
    ], []);

    const defaultValue = Arrays.first(options.filter(current => current.value === (docMeta?.docInfo.columnLayout || 1)))!.id;

    return React.useCallback(() => {

        dialogs.select({
            title: "Set Document Layout",
            description: "Set the number of columns that this document uses.  We use this setting to better position annotations in the sidebar view.",
            options,
            defaultValue,
            onCancel: NULL_FUNCTION,
            onDone: (selected => {
                setColumnLayout(selected.value);
            })

        });

    }, [defaultValue, dialogs, options, setColumnLayout]);

}


export const DocViewerToolbarOverflowButton = deepMemo(function DocViewerToolbarOverflowButton(props: IProps) {

    const linkLoader = useLinkLoader();
    const toolbarClasses = useDocViewerToolbarStyles();

    const {closeCurrentTab} = useSideNavCallbacks();

    const setColumnLayoutCallback = useSetColumnLayoutCallback();

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const url = props.docInfo?.url!;

    return (

        <MUIMenu caret
                 placement="bottom-end"
                 button={{
                     icon: <MoreVertIcon className={toolbarClasses.toolbarFontColor} />,
                     size: 'small',
                 }}>

            <div className={toolbarClasses.toolbarFontColor}>
                <MUIMenuItem text="Open Original URL in Browser"
                             icon={<OpenInBrowserIcon/>}
                             disabled={! props.docInfo?.url}
                             onClick={() => linkLoader(url, {focus: true, newWindow: true})}/>

                <MUIMenuItem text="Copy Original URL to Clipboard"
                             icon={<LinkIcon/>}
                             disabled={! props.docInfo?.url}
                             onClick={() => Clipboards.writeText(url)}/>

                <MUIMenuItem text="Set number of columns"
                             icon={<ViewWeekIcon/>}
                             onClick={setColumnLayoutCallback}/>

                <>
                    <Divider/>

                    <MUIMenuItem text="Close Document"
                                 icon={<CloseIcon/>}
                                 onClick={closeCurrentTab}/>
                </>

            </div>

        </MUIMenu>
    );

});
