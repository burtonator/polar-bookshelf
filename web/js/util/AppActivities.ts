/**
 * Provides a central place to broadcast activities that are happening in the
 * app.
 */
import {Reactor} from '../reactor/Reactor';
import {SimpleReactor} from '../reactor/SimpleReactor';

export class AppActivities {

    private static instance = new SimpleReactor<AppActivity<any>>();

    public static get() {
        return this.instance;
    }

}

export interface AppActivity<T> {
    readonly name: string;
    readonly data?: T;
}
