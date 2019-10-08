import * as React from 'react';
import {AnnotationTypes} from '../../metadata/AnnotationTypes';
import {DocAnnotation} from '../DocAnnotation';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {AnnotationControlBar} from '../AnnotationControlBar';
import {ChildAnnotationSection} from '../child_annotations/ChildAnnotationSection';
import {Doc} from '../../metadata/Doc';
import {LazyProps, LazyState} from '../../react/LazyComponents';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';

export class TextHighlightAnnotationComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {};

    }

    public render() {

        const { annotation } = this.props;

        const attrType = AnnotationTypes.toDataAttribute(annotation.annotationType);

        const html = Optional.first(annotation.html).getOrElse('');

        const key = 'text-highlight-' + annotation.id;

        const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

        return (

            <div className="m-0 mb-2">

                <div key={key}
                     data-annotation-id={annotation.id}
                     data-annotation-type={attrType}
                     data-annotation-color={annotation.color}
                     className={attrType}>

                    {/*NOTE: this HTML layout is specifically designed to prevent */}
                    {/*excess HTML element copying when the user double clicks the */}
                    {/*text.  Placing the elements in the div layout below (with */}
                    {/*trailing empty div in a flexbox parent) prevents the form */}
                    {/*boxes that follow from being selected.*/}

                    <div style={{display: 'flex', flexDirection: 'column'}}>

                        <div style={{display: 'flex'}}>

                            <div className="p-1"
                                        style={{
                                            borderLeft: `5px solid ${borderColor}`
                                        }}>

                            </div>

                            <div className="text-sm"
                                  dangerouslySetInnerHTML={{__html: html}}>

                            </div>

                            <div/>

                        </div>

                        <div>

                            <AnnotationControlBar doc={this.props.doc}
                                                  annotation={annotation}/>

                            <div className="comments">
                                <ChildAnnotationSection doc={this.props.doc}
                                                        parent={annotation}
                                                        docAnnotations={annotation.getChildren()}/>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

}
interface IProps extends LazyProps {

    readonly doc: Doc;

    readonly annotation: DocAnnotation;

}

interface IState extends LazyState {

}

