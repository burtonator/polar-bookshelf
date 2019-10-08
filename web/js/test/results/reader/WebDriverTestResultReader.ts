
import {TestResultReader} from '../TestResultReader';
import {Results} from '../../../util/Results';
import {TApplication} from '../../Spectron';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Latch} from "polar-shared/src/util/Latch";

declare var window: any;

export class WebDriverTestResultReader implements TestResultReader {

    private readonly app: TApplication;

    constructor(app: TApplication) {
        this.app = app;
    }

    public async read2<T>(): Promise<T> {

        const result = await this.app.client.executeAsync((done: (val: any) => void ) => {

            function poll() {

                if (window.SPECTRON_TEST_RESULT !== null &&
                    window.SPECTRON_TEST_RESULT !== undefined) {

                    done(window.SPECTRON_TEST_RESULT);
                    return;

                }

                setTimeout(poll, 250);
            }

            poll();

        });

        return Results.create<T>(result).get();

    }

    public async read<T>(): Promise<T> {

        const latch = new Latch<T>();

        const poll = async () => {

            const response = await this.app.client.executeAsync((done: (val: any) => void) => {

                if (window.SPECTRON_TEST_RESULT !== null &&
                    window.SPECTRON_TEST_RESULT !== undefined) {

                    done(window.SPECTRON_TEST_RESULT);
                    return;

                }

                done(null);

            });

            const result = Results.create<T>(response).get();

            if (isPresent(result)) {
                latch.resolve(result);
            } else {
                setTimeout(() => {
                    poll().catch(err => latch.reject(err));
                }, 250);
            }

        };

        poll().catch(err => latch.reject(err));

        return latch.get();

    }

}
