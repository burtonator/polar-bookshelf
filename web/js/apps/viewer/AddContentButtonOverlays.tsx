import {ReactInjector} from '../../ui/util/ReactInjector';
import {InjectedComponent} from '../../ui/util/ReactInjector';
import React from 'react';
import {AddContentButtonOverlay} from './AddContentButtonOverlay';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';

export class AddContentButtonOverlays {

    public static async create(onClick?: () => void): Promise<InjectedComponent> {

        const id = 'add-content-button-overlay-parent';
        return ReactInjector.inject(<AddContentButtonOverlay onClick={onClick || NULL_FUNCTION}/>, id);

    }

}
