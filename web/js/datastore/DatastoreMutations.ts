import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreConsistency} from './Datastore';
import {Latch} from "polar-shared/src/util/Latch";

export class DatastoreMutations {

    private readonly consistency: DatastoreConsistency;

    private constructor(consistency: DatastoreConsistency) {
        this.consistency = consistency;
    }

    public static create(consistency: DatastoreConsistency): DatastoreMutations {
        return new DatastoreMutations(consistency);
    }


    /**
     * Do a primary sync followed by a secondary sync and then forward their
     * completion to set of mutations.
     */
    private performOrderedWrites<T>(primarySync: (primaryMutations: DatastoreMutation<T>) => Promise<void>,
                                    secondarySync: (secondaryMutations: DatastoreMutation<T>) => Promise<void>,
                                    primaryMutations: DatastoreMutation<T>,
                                    secondaryMutations: DatastoreMutation<T>,
                                    reject: (err: Error) => void) {

        primarySync(primaryMutations)
            .then(() => {
                // noop
            })
            .catch((err) => {
                reject(err);
            });

        // TODO: I used race before but it didn't actually work properly and I
        // think it's incorrect as well.
        Promise.all([primaryMutations.written.get(),
                     primaryMutations.committed.get()])
            .then(() => {
                secondarySync(secondaryMutations)
                    .catch(err => reject(err));

            })
            .catch((err) => {
                reject(err);
            });

    }

    /**
     * Perform a write while coordinating the remote and local writes.
     *
     * The remote operation executes and completes written once it's written
     * locally but potentially still unsafe as it's not 'committed'.  Once it's
     * committed locally (and safe) then we can perform the local operation
     * which is also atomic (and safe).
     *
     * Then we perform BOTH batched operations and make sure they're all both
     * written and committed before returning.
     *
     * The caller DOES NOT need to wait for the promise to complete.  It could
     * put them into queues or just look at the written and committed values
     * on the datastoreMutation as it's moving forward.  This allows us to
     * have a progress bar integrated showing that the sync operations aren't
     * completed yet.
     *
     */
    public async executeBatchedWrite<T>(datastoreMutation: DatastoreMutation<T>,
                                        remoteSync: (remoteMutations: DatastoreMutation<T>) => Promise<void>,
                                        localSync: (localMutations: DatastoreMutation<T>) => Promise<void>,
                                        remoteMutations: DatastoreMutation<T> = new DefaultDatastoreMutation(),
                                        localMutations: DatastoreMutation<T> = new DefaultDatastoreMutation()): Promise<void> {

        const writeRemoteThenLocal = (reject: (err: Error) => void) => {
            this.performOrderedWrites<T>(remoteSync, localSync, remoteMutations, localMutations, reject);
        };

        const writeLocalThenRemote = (reject: (err: Error) => void) => {
            this.performOrderedWrites<T>(localSync, remoteSync, localMutations, remoteMutations, reject);
        };

        return new Promise<void>((resolve, reject) => {

            // writeRemoteThenLocal(reject);
            writeLocalThenRemote(reject);

            this.batched(remoteMutations, localMutations, datastoreMutation);

            switch (this.consistency) {

                case 'committed':

                    remoteMutations.committed.get()
                        .then(() => resolve())
                        .catch((err) => reject(err));

                    break;

                case 'written':

                    localMutations.written.get()
                        .then(() => resolve())
                        .catch((err) => reject(err));

                    break;

            }

        });

    }


    public batched<T>(remoteMutations: DatastoreMutation<T>,
                      localMutations: DatastoreMutation<T>,
                      target: DatastoreMutation<T> ) {

        this.batchPromises(remoteMutations.written.get(), localMutations.written.get(), target.written, 'written');

        this.batchPromises(remoteMutations.committed.get(), localMutations.committed.get(), target.committed, 'committed');

    }

    /**
     *
     * @param remotePromise
     * @param localPromise
     * @param latch
     * @param consistency The consistency this represents.
     */
    private batchPromises<T>(remotePromise: Promise<T>,
                             localPromise: Promise<T>,
                             latch: Latch<T>,
                             consistency: DatastoreConsistency): void {

        const batch = Promise.all([remotePromise, localPromise]);

        batch.then((result) => {
            latch.resolve(result[0]);
        }).catch(err => {
            latch.reject(err);
        });

    }

    /**
     * Handles a datastore mutation including the written and committed latches
     * for the entire delegate.
     */
    public static async handle<V, T>(delegate: () => Promise<V>,
                                     target: DatastoreMutation<T>,
                                     converter: (input: V) => T): Promise<V> {

        try {

            const result = await delegate();
            const converted = converter(result);

            target.written.resolve(converted);
            target.committed.resolve(converted);

            return result;

        } catch (e) {
            target.written.reject(e);
            target.committed.reject(e);
            throw e;
        }

    }

    /**
     * Pipe the resolve and reject status of the latches to the target.
     */
    public static pipe<T, V>(source: DatastoreMutation<T>,
                             target: DatastoreMutation<V>,
                             converter: (input: T) => V): void {

        this.pipeLatch(source.written, target.written, converter, target.id);
        this.pipeLatch(source.committed, target.committed, converter, target.id);

    }

    private static pipeLatch<T, V>(source: Latch<T>,
                                   target: Latch<V>,
                                   converter: (input: T) => V,
                                   targetID: number): void {

        source.get()
            .then((value: T) => {
                target.resolve(converter(value));
            })
            .catch(err => {
                target.reject(err);
            });

    }

}
