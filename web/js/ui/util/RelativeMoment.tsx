import * as React from 'react';
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";


/**
 * A generic wrapper that determines which sub-component to render.
 */
export class RelativeMoment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div className="mt-auto mb-auto text-muted">
                <Moment style={{
                        }}
                        withTitle={true}
                        titleFormat="D MMM YYYY hh:MM A" fromNow>
                    {this.props.datetime}
                </Moment>
            </div>
        );

    }

}
interface IProps {
    readonly datetime: ISODateTimeString;
}

interface IState {

}


