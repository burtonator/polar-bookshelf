import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from '../../../../web/js/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {DeepPureComponent} from '../../../../web/js/react/DeepPureComponent';

const Body = (props: IProps) => {

    const {text, img} = props;

    if (img) {

        return <ResponsiveImg id={props.id} img={img} defaultText=" "/>;

    } else {
        return (
            <div id={props.id}>
                <div>{text || 'no text'}</div>
            </div>
        );
    }

};

export class AnnotationPreview extends DeepPureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        return <div id={this.props.id}>

            <Body {...this.props}/>

            <DateTimeTableCell datetime={this.props.created} className="text-muted text-xs"/>

        </div>;

    }

}
interface IProps {
    readonly id: string;
    readonly text?: string;
    readonly img?: Img;
    readonly created: ISODateTimeString;
}

interface IState {
}

