import * as React from 'react';
import {RepoDocMetaLoader} from '../RepoDocMetaLoader';
import {RepoDocMetaManager} from '../RepoDocMetaManager';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IEventDispatcher} from '../../../../web/js/reactor/SimpleReactor';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import AnnotationRepoTable from './AnnotationRepoTable';
import {RepoAnnotation} from '../RepoAnnotation';
import {RepoAnnotationMetaView} from './RepoAnnotationMetaView';
import {AnnotationRepoFilterBar} from './AnnotationRepoFilterBar';
import {UpdateFiltersCallback} from './AnnotationRepoFiltersHandler';
import {Dock} from '../../../../web/js/ui/dock/Dock';

export default class PreviewAndMainViewDock extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <Dock left={
                    // TODO: this should become its own component.
                    <div style={{display: 'flex' , flexDirection: 'column', height: '100%'}}>

                        <div className="mb-1 mt-1">

                            <AnnotationRepoFilterBar tagsDBProvider={() => this.props.repoDocMetaManager!.tagsDB}
                                                     updateFilters={this.props.updateFilters}
                                                     tagPopoverPlacement="auto"
                                                     right={
                                                         <div/>
                                                     }
                            />

                        </div>

                        <div style={{flexGrow: 1, overflowY: 'auto'}}>

                            <AnnotationRepoTable persistenceLayerManager={this.props.persistenceLayerManager}
                                                 updatedDocInfoEventDispatcher={this.props.updatedDocInfoEventDispatcher}
                                                 repoDocMetaManager={this.props.repoDocMetaManager}
                                                 repoDocMetaLoader={this.props.repoDocMetaLoader}
                                                 // setFiltered={this.setFilterChannel}
                                                 data={this.props.data}
                                                 onSelected={repoAnnotation => this.onRepoAnnotationSelected(repoAnnotation)}/>

                        </div>

                    </div>
                  }
                  right={
                      <div className="mt-2 pl-1 pr-1"
                           style={{}}>
                          <RepoAnnotationMetaView persistenceLayerManager={this.props.persistenceLayerManager}
                                                  repoAnnotation={this.state.repoAnnotation}/>
                      </div>
                  }
                  side='left'
                  initialWidth={450}/>

        );
    }

    private onRepoAnnotationSelected(repoAnnotation: RepoAnnotation) {
        // console.log("A repo annotation was selected: " , repoAnnotation);

        this.setState({repoAnnotation});

    }

}

export interface IProps {

    readonly persistenceLayerManager: PersistenceLayerManager;

    readonly updatedDocInfoEventDispatcher: IEventDispatcher<IDocInfo>;

    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly repoDocMetaLoader: RepoDocMetaLoader;

    readonly updateFilters: UpdateFiltersCallback;

    readonly data: ReadonlyArray<RepoAnnotation>;

}

export interface IState {

    readonly repoAnnotation?: RepoAnnotation;

}

