import {SnapshotUnsubscriber} from "../firebase/Firebase";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class BackgroundListeners {

    public static create<V>(listenable: BackgroundListenable<V>): BackgroundListener<V> {

        let started: boolean = false;

        let value: V | null;

        let snapshotUnsubscriber: () => void = NULL_FUNCTION;

        return {

            start: async () => {

                if (started) {
                    return;
                }

                value = await listenable.get();

                snapshotUnsubscriber = await listenable.onSnapshot(currentValue => {
                    value = currentValue;
                });

                started = true;

            },

            get: () => {

                if (! started) {
                    throw new Error("Not started");
                }

                return value!;

            },

            stop: () => {

                if (! started) {
                    return;
                }

                snapshotUnsubscriber();
            }

        };

    }

}

export interface BackgroundListener<V> {

    start(): Promise<void>;

    get(): V;

    stop(): void;

}

export interface BackgroundListenable<V> {

    get(): Promise<V>;

    onSnapshot(handler: (value: V) => void): Promise<SnapshotUnsubscriber>;

}


