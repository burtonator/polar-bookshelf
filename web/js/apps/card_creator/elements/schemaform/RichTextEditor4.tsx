/**
 * This is our main widget for handling text fields which are HTML.
 */
import ReactSummernote from './ReactSummernote';
import React from 'react';
import {TypedWidgetProps} from './TypedWidgetProps';
import {Logger} from 'polar-shared/src/logger/Logger';
import {ReactSummernote4} from './ReactSummernote4';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {RichTextMutator} from './RichTextMutator';
const log = Logger.create();

/**
 * Rich text editor component based of ReactSummernote4
 */
export class RichTextEditor4 extends React.Component<IProps, IState>  {

    private readonly typedWidgetProps: TypedWidgetProps;

    private value: string = "";

    private id: string;

    constructor(props: IProps) {
        super(props);

        if (props.id) {
            this.id = props.id;
        } else {
            throw new Error("No ID");
        }

        this.typedWidgetProps = new TypedWidgetProps(props);

        if (this.typedWidgetProps.value) {
            this.value = this.typedWidgetProps.value;
        }

        // needed because React changes 'this' to the Element it created which
        // is a bit confusing.
        this.onChange = this.onChange.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

    }

    // FIXME: there is an errorSchema here too which I might want to look at.
    private onChange(newValue: string) {

        // FIXME: summernote has isEmpty and some other methods I need to use
        // here.

        // console.log('onChange: newValue: ', newValue);

        // log.debug('onChange', newValue);

        this.value = newValue;

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }

    }

    private onBlur() {
        // log.info("onBlur");

        if (this.props.onBlur) {
            this.props.onBlur(this.id, this.value);
        }


    }

    private onFocus() {
        // log.info("onFocus");

        if (this.props.onFocus) {
            this.props.onFocus(this.id, this.value);
        }

    }

    /**
     * This is a workaround documented here:
     *
     * https://github.com/summernote/react-summernote/issues/38
     */
    public onImageUpload(images: any[], insertImage: Function) {

        log.debug('onImageUpload', images);
        /* FileList does not support ordinary array methods */
        for (let i = 0; i < images.length; i++) {
            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(images[i]);
        }

    }

    public render() {

        // https://github.com/summernote/react-summernote/issues/38

        const onKeyDown: (event: KeyboardEvent) => void =
            this.props.onKeyDown ? this.props.onKeyDown : NULL_FUNCTION;

        return (
            <ReactSummernote4
                value={this.props.value || ''}
                options={{
                    id: this.typedWidgetProps.id,
                    lang: 'en-US',
                    height: 180,
                    disableResizeEditor: true,
                    placeholder: this.props.placeholder || '',
                    dialogsInBody: false,
                    airMode: false,
                    // used to fix issues with tab navigation
                    tabSize: 0,
                    // toolbar: [
                    //     ['style', []],
                    //     ['font', []],
                    //     ['fontname', []],
                    //     ['para', []],
                    //     ['table', []],
                    //     ['insert', []],
                    //     ['view', []],
                    //     ['image', []]
                    // ]

                    // FIXME: somehow images paste has broken now...

                    // FIXME: add blockquote, code, and pre, and cite

                    // missing the highlight color pulldown...

                    toolbar: [
                        ['style', ['style']],
                        // ['font', ['bold', 'italic', 'underline', 'clear', 'color', 'superscript', 'subscript']],
                        ['font', ['bold', 'italic', 'underline']],
                        // ['fontname', ['fontname']],
                        // ['para', ['ul', 'ol', 'paragraph']],
                        ['para', ['paragraph']],
                        ['table', ['table']],
                        // ['insert', ['link', 'picture', 'video']],
                        ['insert', ['link', 'picture']],
                        ['view', []]
                    ]

                }}
                autofocus={this.props.autofocus}
                onChange={this.onChange}
                onKeyDown={(event: any) => onKeyDown(event.originalEvent)}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                // onSubmit={this.onSubmit}
                onImageUpload={this.onImageUpload}
                onRichTextMutator={this.props.onRichTextMutator}
            />

        );

    }

}

interface IProps {
    readonly id: string;
    readonly autofocus?: boolean;
    readonly value?: string;
    readonly onKeyDown?: (event: KeyboardEvent) => void;
    readonly onChange?: (newValue: string) => void;
    readonly onBlur?: (id: string, value: string) => void;
    readonly onFocus?: (id: string, value: string) => void;
    readonly placeholder?: string;
    readonly onRichTextMutator?: (mutator: RichTextMutator) => void;
}

interface IState {

}

interface OnChangeCallback {
    (newValue: string): void;
}

/**
 * Used for onFocus and onBlur
 */
interface OnSelectionCallback {
    (id: string, value: string): void;
}

