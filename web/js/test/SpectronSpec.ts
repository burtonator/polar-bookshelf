import {assert} from 'chai';
import {TApplication} from './Spectron';
import {WebDriverTestResultReader} from './results/reader/WebDriverTestResultReader';
import {Concurrently} from '../util/Concurrently';

/**
 * Allows us to easily await for the test to finish.
 */
export class SpectronSpec {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        this.app = app;
    }

    public async waitFor(val: any): Promise<this> {

        // wait for at least one window (which is the main one that will hold our value)
        await Concurrently.waitForPredicate(() => this.app.client.getWindowCount(),
                                            (windowCount: number) => windowCount >= 1 );

        const testResultReader = new WebDriverTestResultReader(this.app);
        assert.equal(await testResultReader.read(), val);

        return this;

    }

    public static create(app: TApplication) {
        return new SpectronSpec(app);
    }

    public stop() {
        this.app.stop();
    }

}
