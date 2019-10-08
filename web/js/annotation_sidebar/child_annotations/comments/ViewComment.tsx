import * as React from 'react';
import Moment from 'react-moment';
import {DocAnnotation} from '../../DocAnnotation';
import {CommentDropdown} from '../CommentDropdown';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../react/IStyleMap';
import {Doc} from '../../../metadata/Doc';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {DocAnnotations} from "../../DocAnnotations";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";

const log = Logger.create();

const Styles: IStyleMap = {

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ViewComment extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.state = {};

    }

    public render() {
        const { comment } = this.props;

        const key = 'comment-' + comment.id;

        return (

            <div className="m-1 mb-2">

                <div key={key} className="comment">

                    <div className="pb-1 pt-1">

                        {/*TODO: based on the state determine if we should be*/}
                        {/*editing or just displaying the comment*/}

                        <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                        </span>

                    </div>

                    <div style={Styles.barBody}
                         className="flexbar comment-bar border-bottom pt-0 pb-0 mb-1">

                        <DocAuthor author={comment.author}/>

                        <div style={Styles.barChild} className="text-muted">
                            <DocAnnotationMoment created={comment.created}/>
                        </div>

                        <div style={Styles.barChild} className="flexbar-right">

                            <NullCollapse open={! comment.immutable}>
                                {this.props.editButton}
                            </NullCollapse>

                            <div className="ml-1">
                                <CommentDropdown id={'comment-dropdown-' + comment.id}
                                                 disabled={comment.immutable}
                                                 comment={comment}
                                                 onDelete={() => this.onDelete(comment)}/>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );

    }

    private onDelete(comment: DocAnnotation) {
        log.info("Comment deleted: ", comment);
        delete comment.pageMeta.comments[comment.id];
    }

}
interface IProps {
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly editButton: JSX.Element;
}

interface IState {

}


