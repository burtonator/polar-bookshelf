import * as React from 'react';
import {BaseDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {ResponsiveImg} from "../../../../../../web/js/annotation_sidebar/ResponsiveImg";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {DocFileResolvers} from "../../../../../../web/js/datastore/DocFileResolvers";
import {PersistenceLayerProvider} from "../../../../../../web/js/datastore/PersistenceLayer";
import {Images} from "../../../../../../web/js/metadata/Images";
import {ProfileRecord} from "../../../../../../web/js/datastore/sharing/db/ProfileJoins";
import {GroupDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";

const Image = (props: IProps) => {

    const {docAnnotationProfileRecord, persistenceLayerProvider} = props;
    const docAnnotation = docAnnotationProfileRecord.value;

    const areaHighlight = docAnnotation.original as IAreaHighlight;

    const docFileResolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);

    const img = Images.toImg(docFileResolver, areaHighlight.image);

    if (img) {

        return (
            <ResponsiveImg id={areaHighlight.id} img={img} color={areaHighlight.color}/>
        );

    } else {
        return (
            <div>No image</div>
        );
    }

};

export class AreaHighlightDocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {
        const {props} = this;
        const {docAnnotationProfileRecord} = props;
        const docAnnotation = docAnnotationProfileRecord.value;

        const areaHighlight = docAnnotation.original as IAreaHighlight;

        const key = 'area-highlight' + docAnnotation.id;
        const borderColor = HighlightColors.toBackgroundColor(areaHighlight.color, 0.7);

        return (

            <div key={key}
                 className='p-1'>

                <div style={{
                    borderLeft: `5px solid ${borderColor}`
                }}>

                    <Image persistenceLayerProvider={this.props.persistenceLayerProvider}
                           docAnnotationProfileRecord={docAnnotationProfileRecord}/>

                </div>

            </div>
        );

    }

}
interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly docAnnotationProfileRecord: ProfileRecord<BaseDocAnnotation>;
}

interface IState {
}

