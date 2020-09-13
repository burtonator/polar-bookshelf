import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {RichTextArea} from "../../RichTextArea";
import Button from "@material-ui/core/Button";
import {IDocAnnotationRef} from "../../DocAnnotation";
import {
    ITextHighlightRevert,
    ITextHighlightUpdate,
    useAnnotationMutationsContext
} from '../../AnnotationMutationsContext';
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";
import {InputCompleteListener} from "../../../mui/complete_listeners/InputCompleteListener";

interface IProps {
    readonly id: string;
    readonly html: string;
    readonly annotation: IDocAnnotationRef;

}

export const EditTextHighlight2 = (props: IProps) => {

    const {annotation} = props;

    const htmlRef = React.useRef<string>(props.html);

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutations = useAnnotationMutationsContext();

    if (annotationInputContext.active !== 'text-highlight') {
        return null;
    }

    function handleKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.props.onChanged(this.html);
        }

    }

    function handleRevert() {

        annotationInputContext.reset();

        const mutation: ITextHighlightRevert = {
            selected: [annotation],
            type: 'revert',
        }

        annotationMutations.onTextHighlight(mutation);
    }

    function handleChange(body: string) {

        annotationInputContext.reset();

        const mutation: ITextHighlightUpdate = {
            selected: [annotation],
            type: 'update',
            body
        }

        annotationMutations.onTextHighlight(mutation);

    }

    function onComplete() {
        handleChange(htmlRef.current);
    }

    return (
        <InputCompleteListener onComplete={onComplete}>
            <div className="m-1">

                <div className="">

                    <RichTextArea id={props.id}
                                  defaultValue={props.html}
                                  autofocus={true}
                                  onKeyDown={handleKeyDown}
                                  onChange={(html) => htmlRef.current = html}/>

                </div>

                <div style={{
                         display: 'flex',
                         justifyContent: 'flex-end'
                     }}>

                    <CancelButton onClick={annotationInputContext.reset}/>

                    <Button onClick={handleRevert}>

                        Revert

                    </Button>

                    <Button color="primary"
                            variant="contained"
                            onClick={onComplete}>

                        Change

                    </Button>

                </div>

            </div>
        </InputCompleteListener>
    );
};
