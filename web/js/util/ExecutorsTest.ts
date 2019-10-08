import {Executors} from './Executors';
import {Latch} from "polar-shared/src/util/Latch";

describe('Executors', function() {

    it("basic", async function() {

        let iter = 0;

        const latch = new Latch();

        const completion = new Latch();

        const onCompletion = () => {
            completion.resolve(true);
        };

        Executors.runPeriodically( {interval: '100ms', maxIterations: 5, onCompletion}, () => {
            ++iter;

            if (iter === 5) {
                latch.resolve(true);
            }

        } );

        await latch.get();
        await completion.get();

    });

});
