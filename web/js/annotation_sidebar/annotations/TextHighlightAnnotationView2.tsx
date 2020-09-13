import * as React from 'react';
import {AnnotationTypes} from '../../metadata/AnnotationTypes';
import {IDocAnnotationRef} from '../DocAnnotation';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import {AnnotationViewControlBar2} from "../AnnotationViewControlBar2";
import {AnnotationTagsBar} from "../AnnotationTagsBar";
import {deepMemo} from "../../react/ReactUtils";
import {AnnotationDivider} from "./AnnotationDivider";


interface IProps {
    readonly annotation: IDocAnnotationRef;
}

export const TextHighlightAnnotationView2 = deepMemo((props: IProps) => {

    const { annotation } = props;

    const attrType = AnnotationTypes.toDataAttribute(annotation.annotationType);

    const html = Optional.first(annotation.html).getOrElse('');

    const key = 'text-highlight-' + annotation.id;

    const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

    return (
        <>
            <div key={key}
                 data-annotation-id={annotation.id}
                 data-annotation-type={attrType}
                 data-annotation-color={annotation.color}
                 className={attrType}
                 style={{
                     borderLeft: `4px solid ${borderColor}`,
                     paddingLeft: '8px',
                     paddingRight: '5px'
                 }}>

                {/*WARNING: this HTML layout is specifically designed to prevent */}
                {/*excess HTML element copying when the user double clicks the */}
                {/*text.  Placing the elements in the div layout below (with */}
                {/*trailing empty div in a flexbox parent) prevents the form */}
                {/*boxes that follow from being selected.*/}

                <div style={{
                         display: 'flex',
                         flexDirection: 'column'
                     }}>

                    <div style={{marginTop: '5px'}}>
                        <AnnotationTagsBar tags={annotation.original.tags}/>
                    </div>

                    <div style={{display: 'flex'}}>

                        <div className="text-sm"
                             dangerouslySetInnerHTML={{__html: html}}>

                        </div>

                        <div/>

                    </div>

                    <div>
                        <AnnotationViewControlBar2 annotation={annotation}/>
                    </div>

                </div>

            </div>
            <AnnotationDivider/>
        </>

    );
});
