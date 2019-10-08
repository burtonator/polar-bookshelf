import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocAnnotations} from './DocAnnotations';
import {DocAnnotation} from './DocAnnotation';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {DocAnnotationComponent} from './annotations/DocAnnotationComponent';
import {ExportButton} from '../ui/export/ExportButton';
import {Exporters, ExportFormat} from '../metadata/exporter/Exporters';
import {SplitBar, SplitBarRight} from '../../../apps/repository/js/SplitBar';
import {PersistenceLayerProvider} from '../datastore/PersistenceLayer';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Doc} from '../metadata/Doc';
import {GroupSharingButton} from '../ui/group_sharing/GroupSharingButton';
import {DocMeta} from "../metadata/DocMeta";
import {Firebase} from "../firebase/Firebase";
import {DocMetaListeners, DocMetaRecords} from "../datastore/sharing/db/DocMetaListeners";
import {DocMetas} from "../metadata/DocMetas";
import {UserProfiles} from "../datastore/sharing/db/UserProfiles";
import {DocAnnotationIndexManager} from "./DocAnnotationIndexManager";
import {DocFileResolvers} from "../datastore/DocFileResolvers";
import {SplitBarLeft} from '../../../apps/repository/js/SplitBarLeft';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

const log = Logger.create();

const NoAnnotations = () => {
    return (
        <div className="p-2">

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
    );
};

function createItems(render: IRender) {

    // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778

    // TODO: I'm not sure what type of class a <div> or React element uses
    // so using 'any' for now.

    const result: any = [];

    const {annotations} = render;

    annotations.map(annotation => {
        result.push (<DocAnnotationComponent key={annotation.id}
                                             annotation={annotation}
                                             persistenceLayerProvider={render.persistenceLayerProvider}
                                             doc={render.doc}/>);
    });


    return result;

}

const AnnotationsBlock = (render: IRender) => {

    if (render.annotations.length > 0) {
        return createItems(render);
    } else {
        return <NoAnnotations/>;
    }

};

const Annotations = (render: IRender) => {

    return <div className="annotations">
        <AnnotationsBlock {...render}/>
    </div>;

};

export class AnnotationSidebar extends React.Component<IProps, IState> {

    private docAnnotationIndex: DocAnnotationIndex;
    private docAnnotationIndexManager: DocAnnotationIndexManager;

    constructor(props: IProps, context: any) {
        super(props, context);

        const {persistenceLayerProvider} = this.props;

        this.docAnnotationIndex = new DocAnnotationIndex();

        this.docAnnotationIndexManager
            = new DocAnnotationIndexManager(DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider),
                                            this.docAnnotationIndex, annotations => {

                this.setState({annotations});

            });

        this.onExport = this.onExport.bind(this);

        this.state = {
            annotations: []
        };

    }

    public componentDidMount(): void {

        this.init()
            .catch(err => log.error("Failed init: ", err));


    }

    private async init() {

        await this.buildInitialAnnotations();

        await this.registerListenerForPrimaryDocMeta();

        await this.registerListenersForSecondaryDocMetas();

    }

    private async buildInitialAnnotations() {

        const docFileResolver = DocFileResolvers.createForPersistenceLayer(this.props.persistenceLayerProvider);
        const docAnnotations = await DocAnnotations.getAnnotationsForPage(docFileResolver,
                                                                          this.docAnnotationIndex,
                                                                          this.props.doc.docMeta);

        this.docAnnotationIndex.put(...docAnnotations);

        this.reload();

    }

    private async registerListenerForPrimaryDocMeta() {

        const {docMeta} = this.props.doc;

        const userProfile = await UserProfiles.currentUserProfile();

        if (userProfile) {

            DocMetas.withSkippedMutations(docMeta, () => {
                DocMetaRecords.applyAuthorsFromUserProfile(docMeta, userProfile);
            });

        }

        this.docAnnotationIndexManager.registerListenerForDocMeta(docMeta, {noSync: false});

    }

    /**
     * Register listeners for group docs when using Firebase.
     */
    private async registerListenersForSecondaryDocMetas() {

        const user = await Firebase.currentUser();

        if (!user) {
            return;
        }

        const fingerprint = this.props.doc.docMeta.docInfo.fingerprint;

        const docMetaHandler = (docMeta: IDocMeta) => {
            this.docAnnotationIndexManager.registerListenerForDocMeta(docMeta, {noSync: false});
        };

        const errHandler = (err: Error) => {
            log.error("Failed to handle docMeta group group: ", err);
        };

        await DocMetaListeners.register(fingerprint, docMetaHandler, errHandler);

    }

    private reload() {

        const annotations = this.docAnnotationIndex.getDocAnnotationsSorted();

        this.setState({
            annotations
        });

    }

    private onExport(path: string, format: ExportFormat) {

        Exporters.doExport(path, this.props.persistenceLayerProvider(), format, this.props.doc.docMeta)
            .catch(err => log.error(err));

    }

    public render() {

        const persistenceLayer = this.props.persistenceLayerProvider();
        const capabilities = persistenceLayer.capabilities();

        const AnnotationHeader = () => {

            return (

                <div className="p-1 pb-2 mb-3 border-bottom pl-1 pr-1 text-md">

                    <SplitBar>

                        <SplitBarLeft>
                            <div style={{
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                 }}>
                                Annotations
                            </div>
                        </SplitBarLeft>

                        <SplitBarRight>

                            <ExportButton onExport={(path, format) => this.onExport(path, format)}/>

                            <GroupSharingButton doc={this.props.doc}
                                                datastoreCapabilities={capabilities}
                                                onDone={NULL_FUNCTION}/>

                        </SplitBarRight>


                    </SplitBar>

                </div>

            );

        };

        return (

            <div id="annotation-manager" className="annotation-sidebar">

                <AnnotationHeader/>

                <Annotations {...this.state} {...this.props}/>

            </div>

        );
    }

}

interface IProps {
    readonly doc: Doc;
    readonly persistenceLayerProvider: PersistenceLayerProvider;
}

interface IState {
    readonly annotations: ReadonlyArray<DocAnnotation>;
}

interface IRender extends IProps, IState {

}
