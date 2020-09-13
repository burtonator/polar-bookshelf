import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";
import {useAnnotationRepoStore} from './AnnotationRepoStore';
import {IDocAnnotation} from "../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationActiveInputContextProvider} from "../../../../web/js/annotation_sidebar/AnnotationActiveInputContext";
import {DocMetaContextProvider} from "../../../../web/js/annotation_sidebar/DocMetaContextProvider";
import {AnnotationView2} from "../../../../web/js/annotation_sidebar/annotations/AnnotationView2";
import {AnnotationInlineControlBar} from './AnnotationInlineControlBar';

const NoAnnotationSelected = () => (
    <Box p={1}>

        <div className="text-center">
            <Typography align="center"
                        variant="h5"
                        color="textPrimary">
                No annotation selected.
            </Typography>
        </div>

    </Box>
);

interface AnnotationSelectedProps {
    readonly annotation: IDocAnnotation;
}

const AnnotationSelected = React.memo((props : AnnotationSelectedProps) => {

    const {annotation} = props;

    const doc = {
        docMeta: annotation.docMeta,
        mutable: true
    };

    return (

        <Paper square
               elevation={0}
               style={{
                   display: 'flex',
                   flexGrow: 1,
                   flexDirection: 'column'
               }}>

            <AnnotationActiveInputContextProvider>
                <>
                    <DocMetaContextProvider doc={doc}>

                        <>
                            <AnnotationInlineControlBar annotation={annotation}/>

                            <div className="mt-1">
                                <AnnotationView2 annotation={annotation}/>
                            </div>
                        </>
                    </DocMetaContextProvider>
                </>
            </AnnotationActiveInputContextProvider>

        </Paper>
    );
});

export const AnnotationInlineViewer2 = React.memo(() => {

    const {selected, viewPage} = useAnnotationRepoStore(['selected', 'viewPage']);

    const annotation = selected.length > 0 ? viewPage.filter(current => current.id === selected[0])[0] : undefined;

    if (annotation) {

        return (
            <AnnotationSelected annotation={annotation}/>
        );

    } else {
        return (
            <NoAnnotationSelected/>
        );

    }

});


