import {SimpleReactor} from "../reactor/SimpleReactor";

/**
 * Allows us to expose synchronization state between the local datastore
 * (the disk datastore) and whatever cloud / backend provider the user is using.
 *
 * The sychronizer exposes events on progress that allow the UI to update
 * progress bars and log messages to notify the user of their current state.
 */
export class Synchronizer {

    private reactor: SimpleReactor<ProgressEvent> = new SimpleReactor();

    public addEventListener(listener: (event: ProgressEvent) => void): void {
        this.reactor.addEventListener(listener);
    }

}

/**
 * The high level progress event which is emitted occassionally while
 * synchronization is happening.
 */
export interface ProgressEvent {

    /**
     * The overall percentage of the current sychronization.
     */
    percentage: number;

    /**
     * The current operation being performed.
     */
    task: Task;

}

export interface Task {

    /**
     * The name of the task being performed. Usually the name of the file.
     */
    name: string;

    type: 'docmeta' | 'file'

    /**
     * The percentage complete of this specific task.
     */
    percentage: number;

}

