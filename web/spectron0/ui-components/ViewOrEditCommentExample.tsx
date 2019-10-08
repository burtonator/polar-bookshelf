import * as React from 'react';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {DocAnnotation} from '../../js/annotation_sidebar/DocAnnotation';
import {Proxies} from '../../js/proxies/Proxies';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {Comments} from "../../js/metadata/Comments";
import {ObjectIDs} from '../../js/util/ObjectIDs';

export class ViewOrEditCommentExample extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const docMeta = Proxies.create(MockDocMetas.createWithinInitialPagemarks('0x001', 4));

        const html = 'This is <b>the</b> comment.';

        const comment = Comments.createHTMLComment(html, 'page:1');
        //
        // const commentDocAnnotation: DocAnnotation = {
        //     oid: ObjectIDs.create(),
        //     id: '01010101',
        //     annotationType: AnnotationType.COMMENT,
        //     html,
        //     pageNum: 1,
        //     position: {x: 0, y: 0 },
        //     created: "2018-10-23T21:06:22+00:00",
        //     // the reference to a parent annotation if this is a child
        //     // annotation.
        //     docMeta,
        //     pageMeta: docMeta.pageMetas[1],
        //     original: comment
        // };

        return (

            <div>

                {/*<ViewOrEditComment id='test' comment={commentDocAnnotation} onComment={NULL_FUNCTION}/>*/}

            </div>

        );
    }

}


interface IProps {
}

interface IState {
}


