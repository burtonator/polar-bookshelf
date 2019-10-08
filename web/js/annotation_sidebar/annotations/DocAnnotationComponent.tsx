import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {AreaHighlightAnnotationComponent} from './AreaHighlightAnnotationComponent';
import {TextHighlightAnnotationComponent} from './TextHighlightAnnotationComponent';
import {Doc} from '../../metadata/Doc';
import {PersistenceLayerProvider} from '../../datastore/PersistenceLayer';

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

        const { annotation } = this.props;

        if (! isPresent(annotation.id)) {
            log.warn("No annotation id!", annotation);
            return;
        }

        if (annotation.id.trim() === '') {
            log.warn("Empty annotation");
            return;
        }

        const key = 'doc-annotation-' + annotation.id;

        if (annotation.annotationType === AnnotationType.AREA_HIGHLIGHT) {

            return (
                <AreaHighlightAnnotationComponent key={key}
                                                  annotation={annotation}
                                                  doc={this.props.doc}/>
            );

        } else {

            return (
                <TextHighlightAnnotationComponent key={key}
                                                  annotation={annotation}
                                                  doc={this.props.doc}/>
            );

        }


    }

}
interface IProps {

    readonly persistenceLayerProvider: PersistenceLayerProvider;

    readonly annotation: DocAnnotation;

    readonly doc: Doc;

}

interface IState {

}

