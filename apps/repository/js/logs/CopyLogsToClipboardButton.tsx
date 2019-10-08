import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MemoryLogger} from '../../../../web/js/logger/MemoryLogger';
import {Toaster} from '../../../../web/js/ui/toaster/Toaster';
import {Clipboards} from '../../../../web/js/util/system/clipboard/Clipboards';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

class Styles {

}

export default class CopyLogsToClipboardButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);


    }

    public render() {

        return (
            <Button size="sm" onClick={() => this.onClick()}>
                Copy to Clipboard
            </Button>
        );

    }

    private onClick() {

        const messages = MemoryLogger.toView();

        const text = messages.map(current => {

            if (current.args && current.args.length > 0) {
                const args = JSON.stringify(current.args);
                return `${current.timestamp}: ${current.msg}: ${args}`;
            } else {
                return `${current.timestamp}: ${current.msg}`;
            }

        }).join("\n");

        Clipboards.getInstance().writeText(text);

        Toaster.success("Wrote log output to clipboard.");

    }

}



export interface IProps {

}

export interface IState {

}
