import * as React from 'react';
import {IDocAnnotationRef} from '../DocAnnotation';
import {ResponsiveImg} from '../ResponsiveImg';
import {HighlightColors} from 'polar-shared/src/metadata/HighlightColor';
import {AnnotationViewControlBar2} from "../AnnotationViewControlBar2";
import {AnnotationTagsBar} from "../AnnotationTagsBar";
import {deepMemo} from "../../react/ReactUtils";
import {AnnotationDivider} from "./AnnotationDivider";

const Image = (props: IProps) => {

    const {annotation} = props;
    const {img} = annotation;

    if (img) {

        return (
            <ResponsiveImg id={annotation.id} img={annotation.img} color={annotation.color}/>
        );
    } else {
        return (
            <div>No image</div>
        );
    }

};


interface IProps {
    readonly annotation: IDocAnnotationRef;
}
export const AreaHighlightAnnotationView2 = deepMemo((props: IProps) => {

    const {annotation} = props;

    const key = 'area-highlight' + annotation.id;
    const borderColor = HighlightColors.toBackgroundColor(annotation.color, 0.7);

    return (

        // TODO: we need the ability to scroll to the most recent
        // annotation that is created but I need a functional way to do
        // this because how do I determine when it loses focus?

        <>
            <div key={key}
                 className=""
                 style={{
                     paddingLeft: '8px',
                     paddingRight: '5px',
                     borderLeft: `4px solid ${borderColor}`
                 }}>

                <div>

                    <div style={{marginTop: '5px'}}>
                        <AnnotationTagsBar tags={annotation.original.tags}/>
                    </div>

                    <div>

                        <Image {...props}/>

                        <AnnotationViewControlBar2 annotation={annotation}/>

                    </div>

                </div>


            </div>

            <AnnotationDivider/>

        </>
    );

});
