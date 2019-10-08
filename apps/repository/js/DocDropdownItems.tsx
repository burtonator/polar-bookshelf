import * as React from 'react';
import {RepoDocInfo} from './RepoDocInfo';
import {shell} from 'electron';
import {Directories} from '../../../web/js/datastore/Directories';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import {Clipboards} from '../../../web/js/util/system/clipboard/Clipboards';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Dialogs} from '../../../web/js/ui/dialogs/Dialogs';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

export class DocDropdownItems extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.onSetTitle = this.onSetTitle.bind(this);
        this.onCopyURL = this.onCopyURL.bind(this);

        this.onDeleteRequested = this.onDeleteRequested.bind(this);
        this.onSetTitleRequested = this.onSetTitleRequested.bind(this);

    }

    public render() {

        return (

            <div>

                <DropdownItem toggle={this.props.toggle}
                              onClick={() => this.props.onDocumentLoadRequested(this.props.repoDocInfo)}>
                    Open Document
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              onClick={() => this.onSetTitleRequested()}>
                    Set Title
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              disabled={! this.props.repoDocInfo.url}
                              onClick={() => this.onCopyURL(this.props.repoDocInfo.url!)}>
                    Copy Original URL
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              disabled={! this.props.repoDocInfo.filename}
                              hidden={AppRuntime.isBrowser()}
                              onClick={() => this.onShowFile(this.props.repoDocInfo.filename!)}>
                    Show File
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              disabled={! this.props.repoDocInfo.filename}
                              hidden={AppRuntime.isBrowser()}
                              onClick={() => this.onCopyFilePath(this.props.repoDocInfo.filename!)}>
                    Copy File Path
                </DropdownItem>

                <DropdownItem toggle={this.props.toggle}
                              disabled={! this.props.repoDocInfo.filename}
                              onClick={() => this.onCopyText(this.props.repoDocInfo.fingerprint, "Document ID copied to clipboard")}>
                    Copy Document ID
                </DropdownItem>

                {/*TODO: maybe load original URL too?*/}

                <DropdownItem divider />

                <DropdownItem toggle={this.props.toggle}
                              className="text-danger"
                              onClick={() => this.onDeleteRequested()}>
                    Delete
                </DropdownItem>

            </div>

        );

    }

    private onSetTitleRequested() {

        Dialogs.prompt({title: "Enter a new title for the document:",
                        defaultValue: this.props.repoDocInfo.title,
                        onCancel: NULL_FUNCTION,
                        onDone: (value) => this.onSetTitle(value)});

    }

    private onDeleteRequested() {

        this.onDelete();

    }

    private onDelete() {
        this.props.onDelete(this.props.repoDocInfo);
    }

    private onShowFile(filename: string) {

        const directories = new Directories();
        const path = FilePaths.join(directories.stashDir, filename);
        shell.showItemInFolder(path);
    }

    private onCopyFilePath(filename: string) {

        const directories = new Directories();
        const path = FilePaths.join(directories.stashDir, filename);

        this.copyText(path);
        Toaster.success("File path copied to clipboard!");

    }

    private onCopyText(text: string, message: string) {
        this.copyText(text);
        Toaster.success(message);
    }

    private onCopyURL(url: string) {
        this.copyText(url);
        Toaster.success("URL copied to clipboard!");
    }

    private copyText(text: string) {
        Clipboards.getInstance().writeText(text);
    }

    private onSetTitle(title: string) {
        this.props.onSetTitle(this.props.repoDocInfo, title);
    }

}

interface IProps {
    readonly id: string;
    readonly repoDocInfo: RepoDocInfo;
    readonly toggle: boolean;
    readonly onDelete: (repoDocInfo: RepoDocInfo) => void;
    readonly onSetTitle: (repoDocInfo: RepoDocInfo, title: string) => void;
    readonly onDocumentLoadRequested: (repoDocInfo: RepoDocInfo) => void;
}

interface IState {

}

