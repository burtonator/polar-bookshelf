import * as React from 'react';
import {IDocAnnotationRef} from '../../DocAnnotation';
import {deepMemo} from "../../../react/ReactUtils";

interface IProps {
    readonly comment: IDocAnnotationRef;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationView2 = deepMemo((props: IProps) => {

    const { comment } = props;

    return (
        <div className="comment muted-color-root">

            <div className="text-sm">

                {/*TODO: based on the state determine if we should be*/}
                {/*editing or just displaying the comment*/}

                <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                </span>

            </div>

        </div>
    );

});



