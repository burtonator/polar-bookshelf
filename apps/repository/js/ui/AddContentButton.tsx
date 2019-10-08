import * as React from 'react';
import {SimpleTooltip} from '../../../../web/js/ui/tooltip/SimpleTooltip';
import {AppRuntime} from '../../../../web/js/AppRuntime';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {ManualDropdown} from '../doc_repo/ManaulDropdown';
import {SimpleTooltipEx} from '../../../../web/js/ui/tooltip/SimpleTooltipEx';
import {AddContentDropdownItem} from './AddContentDropdownItem';
import {AccountUpgrader} from "../../../../web/js/ui/account_upgrade/AccountUpgrader";
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class AddContentButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.doAddFilesFromDisk = this.doAddFilesFromDisk.bind(this);
        this.doCaptureWebPage = this.doCaptureWebPage.bind(this);
        this.doFileUpload = this.doFileUpload.bind(this);
        this.triggerFileUpload = this.triggerFileUpload.bind(this);

        this.state = {
            open: false
        };

    }

    public render() {

        return (

            <ManualDropdown id="add-content-dropdown"
                            direction="down"
                            size="sm">

                <SimpleTooltipEx text="Add content by importing PDFs from your local drive or capturing web pages from the Internet."
                                 placement="bottom">

                    <DropdownToggle size="sm" style={{fontWeight: 'bold'}} color="success" caret>
                        <i className="fas fa-plus" style={{marginRight: '5px'}}/> Add &nbsp;
                    </DropdownToggle>

                </SimpleTooltipEx>

                <DropdownMenu className="shadow">

                    <AddContentDropdownItem id="add-content-import-from-disk"
                                            hidden={AppRuntime.isBrowser()}
                                            tooltip="Add PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
                                            onClick={() => this.doAddFilesFromDisk()}>

                        <i className="fas fa-hdd"/>
                        &nbsp; Add Files from Disk

                    </AddContentDropdownItem>

                    <AddContentDropdownItem id="add-content-import-from-disk-via-file-upload"
                                            hidden={AppRuntime.isElectron()}
                                            tooltip="Upload PDF files from disk in bulk.  Select one PDF or multiple PDFs at once."
                                            onClick={() => this.doFileUpload()}>

                        <i className="fas fa-hdd"/>
                        &nbsp; Upload Documents

                    </AddContentDropdownItem>

                    <AddContentDropdownItem id="add-content-capture-web-page"
                                            hidden={AppRuntime.isBrowser()}
                                            tooltip="Capture a web page from the web and save it for annotation and long term archival."
                                            onClick={() => this.doCaptureWebPage()}>

                        <i className="fab fa-chrome"/>
                        &nbsp; Capture Web Page

                    </AddContentDropdownItem>

                </DropdownMenu>

            </ManualDropdown>

        );

    }
    private doAccountVerifiedAction(delegate: () => void) {

        const handler = async () => {

            const accountUpgrader = new AccountUpgrader();

            if (await accountUpgrader.upgradeRequired()) {
                accountUpgrader.startUpgrade();
                return;
            }

            delegate();

        };

        handler()
            .catch(err => log.error("Unable to add to repository: ", err));

    }

    private doAddFilesFromDisk() {
        this.doAccountVerifiedAction(() => this.props.importFromDisk());
    }

    private doCaptureWebPage() {
        this.doAccountVerifiedAction(() => this.props.captureWebPage());
    }

    private doFileUpload() {
        this.doAccountVerifiedAction(() => this.triggerFileUpload());
    }

    private triggerFileUpload() {
        document.getElementById('file-upload')!.click();
    }

    private toggle(): void {
        this.setState({...this.state, open: !this.state.open});
    }

}

interface IProps {
    readonly importFromDisk: () => void;
    readonly captureWebPage: () => void;
}

interface IState {
    readonly open: boolean;
}
