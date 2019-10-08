
import {ipcRenderer} from 'electron';
import {TestResultService} from './results/TestResultService';
import {RendererTestResultWriter} from './results/writer/RendererTestResultWriter';

export class SpectronRenderer {

    public static setup() {
        new TestResultService().start();
    }

    public static async start(callback: RunCallback): Promise<any> {
        SpectronRenderer.setup();
        const state = new SpectronRendererState();

        const result = await callback(state);

        ipcRenderer.send('spectron-renderer-started', true);

        return result;

    }

    public static run(callback: RunCallback) {
        this.start(callback)
            .catch(err => console.error(err));
    }

}

export interface RunCallback {
    (state: SpectronRendererState): Promise<any>;
}


export class SpectronRendererState {

    get testResultWriter() {
        return new RendererTestResultWriter();
    }

}
