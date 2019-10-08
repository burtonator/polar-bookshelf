import React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Image} from '../../datastore/sharing/db/Images';

export class Img extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        if (this.props.image) {

            return <img alt={this.props.name}
                        src={this.props.image!.url}
                        className="rounded"
                        style={{
                            maxHeight: '32px',
                            maxWidth: '32px'
                        }}/>;

        } else {
            return <div></div>;
        }

    }

}

export class UserImage extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return (

            <Img {...this.props}/>

        );

    }

}

interface IProps {
    readonly name: string;
    readonly image: Image | null;
}

interface IState {
}
