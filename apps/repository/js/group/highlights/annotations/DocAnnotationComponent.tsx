import * as React from 'react';
import {BaseDocAnnotation} from "../../../../../../web/js/datastore/sharing/db/doc_annotations/BaseDocAnnotation";
import {TextHighlightDocAnnotationComponent} from "./TextHighlightDocAnnotationComponent";
import {Logger} from "polar-shared/src/logger/Logger";
import {isPresent} from 'polar-shared/src/Preconditions';
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {PersistenceLayerProvider} from "../../../../../../web/js/datastore/PersistenceLayer";
import {AreaHighlightDocAnnotationComponent} from "./AreaHighlightDocAnnotationComponent";
import {ProfileRecord} from "../../../../../../web/js/datastore/sharing/db/ProfileJoins";

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class DocAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const {docAnnotationProfileRecord} = this.props;
        const docAnnotation = docAnnotationProfileRecord.value;

        if (! isPresent(docAnnotation.id)) {
            log.warn("No annotation id!", docAnnotation);
            return;
        }

        if (docAnnotation.id.trim() === '') {
            log.warn("Empty annotation id");
            return;
        }

        const key = 'doc-annotation-' + docAnnotation.id;

        if (docAnnotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

            return (

                <AreaHighlightDocAnnotationComponent key={key}
                                                     persistenceLayerProvider={this.props.persistenceLayerProvider}
                                                     docAnnotationProfileRecord={docAnnotationProfileRecord}/>
            );

        } else if (docAnnotation.annotationType === AnnotationType.TEXT_HIGHLIGHT) {

            return (
                <TextHighlightDocAnnotationComponent key={key}
                                                     docAnnotationProfileRecord={docAnnotationProfileRecord}/>
            );

        } else {
            return <div/>;
        }


    }

}
interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly docAnnotationProfileRecord: ProfileRecord<BaseDocAnnotation>;
}

interface IState {

}

