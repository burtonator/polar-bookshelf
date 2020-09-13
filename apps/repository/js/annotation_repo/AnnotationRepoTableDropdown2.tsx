import * as React from 'react';
import {ExportFormat} from "../../../../web/js/metadata/exporter/Exporters";
import {Devices} from "polar-shared/src/util/Devices";
import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import GetAppIcon from '@material-ui/icons/GetApp';

interface IProps {
    readonly onExport: (format: ExportFormat) => void;
}

export const AnnotationRepoTableDropdown2 = deepMemo((props: IProps) => {

    if (! Devices.isDesktop()) {
        return null;
    }

    return (

        <div>

            <MUIMenu caret
                     placement="bottom-end"
                     button={{
                         icon: <GetAppIcon/>,
                         size: 'small'
                     }}>

                <div>
                    <MUIMenuItem text="Download as Markdown"
                                 onClick={() => props.onExport('markdown')}/>

                    <MUIMenuItem text="Download as JSON"
                                 onClick={() => props.onExport('json')}/>
                </div>

            </MUIMenu>

        </div>
    );

});
