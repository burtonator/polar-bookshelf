import * as React from 'react';
import {IDocAnnotationRef} from './DocAnnotation';
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import {AnnotationView2} from "./annotations/AnnotationView2";
import {useAnnotationSidebarStore} from '../../../apps/doc/src/AnnotationSidebarStore';
import {AnnotationActiveInputContextProvider} from "./AnnotationActiveInputContext";
import {AnnotationHeader} from './AnnotationSidebarHeader';
import isEqual from "react-fast-compare";
import {memoForwardRef} from "../react/ReactUtils";

const LoadRepositoryExplainer = () => (
    <div className="p-2 text-center">

        <h2 className="text-muted mb-3">
            Click below for your personal repository
        </h2>

        <a href="https://app.getpolarized.io">

            <img alt="Annotation Sidebar"
                 className="img-shadow img-fluid shadow"
                 src="https://getpolarized.io/assets/screenshots/2019-11-document-view.png"/>
        </a>

        <div className="mt-3 mb-3">
             <a href="https://app.getpolarized.io">
                 <Button size="large"
                         variant="contained"
                         color="primary">
                     Load My Doc Repository
                 </Button>
             </a>
         </div>

    </div>
);

const NoAnnotations = memoForwardRef(() => {
    return (
        <div className="p-2"
             style={{
                 display: 'flex',
                 flexDirection: 'column',
                 flexGrow: 1
             }}>

            <div style={{flexGrow: 1}}>
                <h4 className="text-center text-muted text-xxl">
                    No Annotations
                </h4>

                <p className="text-muted"
                   style={{fontSize: '16px'}}>

                    No annotations have yet been created. To create new
                    annotations create a
                    new <span style={{backgroundColor: "rgba(255,255,0,0.3)"}}>highlight</span> by
                    selecting text in the document.
                </p>

                <p className="text-muted"
                   style={{fontSize: '16px'}}>

                    The highlight will then be shown here and you can
                    then easily attach comments and flashcards to it
                    directly.
                </p>

            </div>

            {/*<div>*/}
            {/*    <AppRuntimeRouter browser={(*/}
            {/*        <DeviceRouter desktop={(*/}
            {/*            <LoadRepositoryExplainer/>*/}
            {/*        )}/>*/}
            {/*    )}/>*/}
            {/*</div>*/}

        </div>
    );
});

interface AnnotationSidebarItemProps {
    readonly annotation: IDocAnnotationRef;
}

const AnnotationSidebarItem = memoForwardRef((props: AnnotationSidebarItemProps) => {

    const {annotation} = props;

    return (

        <AnnotationActiveInputContextProvider>
            <>
                <>
                    <AnnotationView2 annotation={annotation}/>
                </>
            </>
        </AnnotationActiveInputContextProvider>

    );

});

const AnnotationsBlock = React.memo(() => {

    const store = useAnnotationSidebarStore(['view']);

    if (store.view.length > 0) {
        return (
            <>
                {store.view.map(annotation => (
                    <AnnotationSidebarItem key={annotation.id}
                                           annotation={annotation}/>))}
            </>
        );

    } else {
        return <NoAnnotations/>;
    }

});

const Annotations = React.memo(() => {

    return (
        <Paper square
               elevation={0}
               className="pb-1 pt-1"
               style={{
                   flexGrow: 1,
                   display: 'flex',
                   flexDirection: 'column',
                   overflow: 'auto'
               }}>
            <AnnotationsBlock/>
        </Paper>
    );

});

/**
 * Second version of the sidebar that is more react-ish...
 */
export const AnnotationSidebar2 = React.memo(() => {

    return (

        <div id="annotation-manager"
             className="annotation-sidebar"
             style={{
                 display: "flex",
                 flexDirection: "column",
                 minHeight: 0,
                 flexGrow: 1
             }}>

            <AnnotationHeader />

            <Annotations />

        </div>

    );
}, isEqual);
