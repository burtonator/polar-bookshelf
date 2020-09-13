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

    private id: string;

    constructor(props: IProps) {
        super(props);

        if (props.id) {
            this.id = props.id;
        } else {
            throw new Error("No ID");
        }

        // needed because React changes 'this' to the Element it created which
        // is a bit confusing.
        this.onChange = this.onChange.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this.typedWidgetProps = new TypedWidgetProps(props);

        this.state = {
            value: this.typedWidgetProps.value || ''
        };


    }

    private onChange(newValue: string) {

        // console.log('onChange: newValue: ', newValue);

        // log.debug('onChange', newValue);

        this.setState({value: newValue});

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }

    }

    private onBlur() {
        // log.info("onBlur");

        if (this.props.onBlur) {
            this.props.onBlur(this.id, this.state.value);
        }


    }

    private onFocus() {
        // log.info("onFocus");

        if (this.props.onFocus) {
            this.props.onFocus(this.id, this.state.value);
        }

    }

    /**
     * This is a workaround documented here:
     *
     * https://github.com/summernote/react-summernote/issues/38
     */
    public onImageUpload(images: any[], insertImage: (arg: any) => void) {

        log.debug('onImageUpload', images);
        /* FileList does not support ordinary array methods */

        for (const image of images) {

            // TODO: this is actually a problem because we CAN NOT store data
            // URLs without some sort of redirect ...

            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(image);

        }

    }

    public render() {

        // https://github.com/summernote/react-summernote/issues/38

        const onKeyDown: (event: KeyboardEvent) => void =
            this.props.onKeyDown ? this.props.onKeyDown : NULL_FUNCTION;

        return (
            <ReactSummernote4
                value={this.state.value}
                defaultValue={this.props.defaultValue}
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
                    keyMap: {
                        pc: {
                            'ESC': 'escape',
                            'ENTER': 'insertParagraph',
                            'CTRL+Z': 'undo',
                            'CTRL+Y': 'redo',
                            'TAB': 'tab',
                            'SHIFT+TAB': 'untab',
                            'CTRL+B': 'bold',
                            'CTRL+I': 'italic',
                            'CTRL+U': 'underline',
                            'CTRL+SHIFT+S': 'strikethrough',
                            'CTRL+BACKSLASH': 'removeFormat',
                            'CTRL+SHIFT+L': 'justifyLeft',
                            'CTRL+SHIFT+E': 'justifyCenter',
                            'CTRL+SHIFT+R': 'justifyRight',
                            'CTRL+SHIFT+J': 'justifyFull',
                            'CTRL+SHIFT+NUM7': 'insertUnorderedList',
                            'CTRL+SHIFT+NUM8': 'insertOrderedList',
                            'CTRL+LEFTBRACKET': 'outdent',
                            'CTRL+RIGHTBRACKET': 'indent',
                            'CTRL+NUM0': 'formatPara',
                            'CTRL+NUM1': 'formatH1',
                            'CTRL+NUM2': 'formatH2',
                            'CTRL+NUM3': 'formatH3',
                            'CTRL+NUM4': 'formatH4',
                            'CTRL+NUM5': 'formatH5',
                            'CTRL+NUM6': 'formatH6',
                            // 'CTRL+ENTER': 'insertHorizontalRule',
                            'CTRL+K': 'linkDialog.show',
                        },

                        mac: {
                            'ESC': 'escape',
                            'ENTER': 'insertParagraph',
                            'CMD+Z': 'undo',
                            'CMD+SHIFT+Z': 'redo',
                            'TAB': 'tab',
                            'SHIFT+TAB': 'untab',
                            'CMD+B': 'bold',
                            'CMD+I': 'italic',
                            'CMD+U': 'underline',
                            'CMD+SHIFT+S': 'strikethrough',
                            'CMD+BACKSLASH': 'removeFormat',
                            'CMD+SHIFT+L': 'justifyLeft',
                            'CMD+SHIFT+E': 'justifyCenter',
                            'CMD+SHIFT+R': 'justifyRight',
                            'CMD+SHIFT+J': 'justifyFull',
                            'CMD+SHIFT+NUM7': 'insertUnorderedList',
                            'CMD+SHIFT+NUM8': 'insertOrderedList',
                            'CMD+LEFTBRACKET': 'outdent',
                            'CMD+RIGHTBRACKET': 'indent',
                            'CMD+NUM0': 'formatPara',
                            'CMD+NUM1': 'formatH1',
                            'CMD+NUM2': 'formatH2',
                            'CMD+NUM3': 'formatH3',
                            'CMD+NUM4': 'formatH4',
                            'CMD+NUM5': 'formatH5',
                            'CMD+NUM6': 'formatH6',
                            // 'CMD+ENTER': 'insertHorizontalRule',
                            'CMD+K': 'linkDialog.show',
                        },
                    },
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

                    // TODO: add blockquote, code, and pre, and cite

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
    readonly defaultValue?: string;
    readonly onKeyDown?: (event: KeyboardEvent) => void;
    readonly onChange?: (newValue: string) => void;
    readonly onBlur?: (id: string, value: string) => void;
    readonly onFocus?: (id: string, value: string) => void;
    readonly placeholder?: string;
    readonly onRichTextMutator?: (mutator: RichTextMutator) => void;
}

interface IState {
    readonly value: string;
}
