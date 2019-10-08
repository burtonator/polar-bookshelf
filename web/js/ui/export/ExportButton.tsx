import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {remote} from 'electron';
import {AppRuntime} from '../../AppRuntime';

export class ExportButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.doExport = this.doExport.bind(this);

    }

    public render() {

        return (
            <div>

                <UncontrolledDropdown direction="down"
                                      hidden={AppRuntime.isBrowser()}
                                      className="mt-auto mb-auto"
                                      size="md">

                    <DropdownToggle color="secondary" caret>

                        <i className="fas fa-file-export" style={{ marginRight: '5px' }}/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow">
                        <DropdownItem onClick={() => this.doExport('markdown')}>Markdown</DropdownItem>
                        <DropdownItem onClick={() => this.doExport('json')}>JSON</DropdownItem>
                    </DropdownMenu>

                </UncontrolledDropdown>

            </div>

        );

    }

    private toExtension(format: ExportFormat) {

        switch (format) {
            case 'markdown':
                return 'md';
            case 'html':
                return 'html';
            case 'json':
                return 'json';
        }

    }

    private doExport(format: ExportFormat) {

        const ext = this.toExtension(format);

        const opts: Electron.SaveDialogOptions = {

            title: "Export to " + format,
            filters: [
                {extensions: [ext], name: format}
            ]

        };

        remote.dialog.showSaveDialog(opts, (path?: string) => {

            if (path && this.props.onExport) {
                this.props.onExport(path, format);
            }

        });

    }

}

interface IProps {
    readonly onExport?: (path: string, format: ExportFormat) => void;
}

interface IState {
}

