import * as React from 'react';
import {ResponsiveImg} from '../../../../web/js/annotation_sidebar/ResponsiveImg';
import {DateTimeTableCell} from '../DateTimeTableCell';
import {Img} from 'polar-shared/src/metadata/Img';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import Box from '@material-ui/core/Box';
import {PlainTextStr, Strings} from "polar-shared/src/util/Strings";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import useTheme from '@material-ui/core/styles/useTheme';

const MAX_TEXT_LENGTH = 300;

function createStyle(color: HighlightColor | undefined): React.CSSProperties {

    if (color) {

        return {
            borderLeftColor: color,
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            paddingLeft: '5px',
        };

    }

    return {
        paddingLeft: '9px',
        paddingRight: '5px',
    };

}

const ImagePreview = deepMemo((props: IProps) => {
    const {img} = props;
    return (
        <ResponsiveImg id={props.id} img={img} defaultText="No image"/>
    );
});

const TextPreview = deepMemo((props: IProps) => {

    const {text} = props;

    const truncated = text ? Strings.truncateOnWordBoundary(text, MAX_TEXT_LENGTH, true) : undefined;

    return (
        <div style={{userSelect: "none"}}
             dangerouslySetInnerHTML={{__html: truncated || 'no text'}}/>
    );

});

interface PreviewParentProps {
    readonly color: HighlightColor | undefined;
    readonly children: React.ReactElement;
}

const PreviewParent = deepMemo((props: PreviewParentProps) => {

    const style = createStyle(props.color);

    return (
        <div style={style}>
            {props.children}
        </div>
    );

});

const Preview = deepMemo((props: IProps) => {

    if (props.img) {
        return <ImagePreview {...props}/>;
    } else {
        return <TextPreview {...props}/>;
    }

});

interface IProps {
    readonly id: string;
    readonly text?: PlainTextStr;
    readonly img?: Img;
    readonly lastUpdated: ISODateTimeString;
    readonly created: ISODateTimeString;
    readonly color: HighlightColor | undefined;
}

export const AnnotationPreview = deepMemo((props: IProps) => {

    const theme = useTheme();

    return (
        <div id={props.id} className="mt-1">
            <PreviewParent color={props.color}>
                <>
                    <Preview {...props}/>

                    <Box mt={1} mb={1}>
                        <DateTimeTableCell
                            datetime={props.lastUpdated || props.created}
                            style={{color: theme.palette.text.secondary}}/>
                    </Box>
                </>

            </PreviewParent>
        </div>
    );
});
