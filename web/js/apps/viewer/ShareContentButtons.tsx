import * as React from 'react';
import {ReactInjector} from '../../ui/util/ReactInjector';
import {ShareContentButton} from './ShareContentButton';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {DatastoreCapabilities} from '../../datastore/Datastore';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {Visibility} from "polar-shared/src/datastore/Visibility";

export class ShareContentButtons {

    public static create(docInfo: IDocInfo,
                         datastoreCapabilities: DatastoreCapabilities,
                         createShareLink: () => Promise<string | undefined>,
                         onVisibilityChanged: (visibility: Visibility) => Promise<void>,
                         onDone: () => void = NULL_FUNCTION) {

        const viewer = document.querySelector('#mainContainer, #content-parent')!;
        const container = document.createElement('div');

        viewer.appendChild(container);

        ReactInjector.create(<ShareContentButton datastoreCapabilities={datastoreCapabilities}
                                                 createShareLink={createShareLink}
                                                 visibility={docInfo.visibility}
                                                 onVisibilityChanged={onVisibilityChanged}
                                                 onDone={onDone}/>, container);

    }

}
