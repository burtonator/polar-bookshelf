import * as React from 'react';
import Moment from 'react-moment';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";


/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAnnotationMoment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (
            <div className="mt-auto mb-auto text-muted">
                {/*TODO: make this into its own component... */}
                <Moment style={{
                            fontSize: '12px'
                        }}
                        withTitle={true}
                        titleFormat="D MMM YYYY hh:MM A" fromNow>
                    {this.props.created}
                </Moment>
            </div>
        );

    }

}
interface IProps {
    readonly created: ISODateTimeString;
}

interface IState {

}


