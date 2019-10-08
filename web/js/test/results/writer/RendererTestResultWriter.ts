import {TestResultWriter} from '../TestResultWriter';
import {TestResult} from '../renderer/TestResult';
import {Logger} from 'polar-shared/src/logger/Logger';
import {isPresent} from 'polar-shared/src/Preconditions';

const log = Logger.create();

/**
 * Write data from the main Electron process.
 */
export class RendererTestResultWriter implements TestResultWriter {

    public async write(result: any) {

        log.info("Got result from renderer: " + result);

        if (!isPresent(result)) {
            throw new Error("No result given!");
        }

        TestResult.set(result);

    }

}
