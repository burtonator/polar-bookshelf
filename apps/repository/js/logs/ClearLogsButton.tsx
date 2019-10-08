import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {MemoryLogger} from '../../../../web/js/logger/MemoryLogger';
import Button from 'reactstrap/lib/Button';

const log = Logger.create();

class Styles {

}

export default class ClearLogsButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <Button size="sm" onClick={() => this.onClick()}>
                Clear
            </Button>
        );

    }

    private onClick() {
        MemoryLogger.clear();
    }

}



export interface IProps {

}

export interface IState {

}
