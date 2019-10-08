import * as React from '@types/react';
import {LogEvent} from './LogEventViewer';
import {ListGroupItem} from '@types/reactstrap';

export class LogEventComponent extends React.Component<IProps, any> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <ListGroupItem className="p-1">{this.props.logEvent.message}</ListGroupItem>

        );

    }

}

interface IProps {
    logEvent: LogEvent;
}
