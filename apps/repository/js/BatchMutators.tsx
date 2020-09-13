import {ProgressMessages} from "../../../web/js/ui/progress_bar/ProgressMessages";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {DialogManager} from "../../../web/js/mui/dialogs/MUIDialogController";
import {IAsyncTransaction} from "polar-shared/src/util/IAsyncTransaction";

export type PromiseFactory<T> = () => Promise<T>;

export namespace BatchMutators {

    export interface BatchMutatorOpts {
        readonly success?: string;
        readonly error?: string;
        readonly id?: string;

        /**
         * Refresh the UI
         */
        readonly refresh?: () => void;

        readonly dialogs: DialogManager;

    }


    export async function exec<T>(transactions: ReadonlyArray<IAsyncTransaction<T>>, opts: BatchMutatorOpts) {

        const refresh = opts.refresh || NULL_FUNCTION;
        const {dialogs} = opts;

        const id = opts.id || Hashcodes.createRandomID();

        interface ProgressReporter {
            readonly incr: () => void;
            readonly terminate: () => void;
        }

        function createProgressReporter(): ProgressReporter {

            if (transactions.length <= 1) {
                return {
                    incr: NULL_FUNCTION,
                    terminate: NULL_FUNCTION
                };
            }

            const progressTracker = new ProgressTracker({
                total: transactions.length,
                id
            });

            const incr = () => {
                const progress = progressTracker.incr();
                ProgressMessages.broadcast(progress);
            }

            const terminate = () => {
                ProgressMessages.broadcast(progressTracker.terminate());
            }

            return {incr, terminate};

        }

        const progressReporter = createProgressReporter();

        try {

            for (const transaction of transactions) {

                transaction.prepare();

                refresh();

                // TODO update progress of this operation using a snackbar
                await transaction.commit();

                // now refresh the UI
                refresh();
                progressReporter.incr();

            }

            if (opts.success) {
                dialogs.snackbar({message: opts.success});
            }

        } catch (e) {

            if (opts.error) {
                // TODO: for the 'error' type it would be nice to associate an
                // Error so that the user could create a report and send it to
                // us
                dialogs.snackbar({
                    message: opts.error + e.message,
                    type: 'error'
                });
            }

        }

        // final must be sent...
        progressReporter.terminate();

    }

}
