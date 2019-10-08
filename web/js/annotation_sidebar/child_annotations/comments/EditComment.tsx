import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {RichTextArea} from "../../RichTextArea";
import {Comment} from '../../../metadata/Comment';
import {RichTextFeatureIntro} from '../../RichTextFeatureIntro';

export class EditComment extends React.Component<IProps, IState> {

    private html: string = "";

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onComment = this.onComment.bind(this);

        if (this.props.existingComment) {
            this.html = this.props.existingComment.content.HTML!;
        }

        this.state = {
            iter: 0
        };

    }

    public render() {

        const id = 'rich-text-editor-' + this.props.id;

        return (
            <div>
                <RichTextFeatureIntro/>

                <div id="annotation-comment-box" className="mt-1">

                    <div className="">

                        <RichTextArea id={id}
                                      value={this.html}
                                      autofocus={true}
                                      onKeyDown={event => this.onKeyDown(event)}
                                      onChange={(html) => this.onChange(html)}/>

                    </div>

                    <div className="flexbar w-100">

                        <div className="flexbar-right mt-1 mb-1">

                            {this.props.cancelButton}

                            <Button color="primary"
                                    size="sm"
                                    className="ml-1"
                                    onClick={() => this.onComment()}>

                                {this.props.existingComment ? 'Update' : 'Comment'}

                            </Button>

                        </div>

                    </div>

                </div>


            </div>

        );

    }

    private onKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onComment();
        }

    }

    private onChange(html: string): void {
        this.html = html;
    }

    private onComment(): void {

        this.props.onComment(this.html, this.props.existingComment);

        this.setState({
            iter: this.state.iter + 1
        });

    }

}

export interface IProps {

    readonly id: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    readonly existingComment?: Comment;

    /**
     * Called when we have a created or updated an existing comment.  If the
     * 'existingComment' is specified when we're doing an update.
     */
    readonly onComment: (html: string, existingComment?: Comment) => void;

    /**
     *
     */
    readonly cancelButton: JSX.Element;

}

export interface IState {
    readonly iter: number;
}


