import {ReactInjector} from '../util/ReactInjector';
import {RestartForUpdateButton} from '../../auto_updates/RestartForUpdateButton';
import React from 'react';
import {ProgressToaster, ProgressUpdater, ProgressUpdate} from './ProgressToaster';
import {Latch} from "polar-shared/src/util/Latch";

export class ProgressToasters {

    public static async create(): Promise<ProgressHandler> {

        // TODO: what happens if there are more than one?

        const latch: Latch<ProgressUpdater> = new Latch();

        const injectedComponent = ReactInjector.inject(<ProgressToaster progressUpdaterLatch={latch}/>);

        const progressUpdater = await latch.get();

        return {

            update(progressUpdate: ProgressUpdate) {
                progressUpdater.update(progressUpdate);
            },

            destroy() {
                injectedComponent.destroy();
            }

        };

    }

}

export interface ProgressHandler extends ProgressUpdater {

    destroy(): void;

}
