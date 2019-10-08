import {Optional} from 'polar-shared/src/util/ts/Optional';
import {LocalPrefs} from '../../util/LocalPrefs';

export class LifecycleToggle extends LocalPrefs {

    // public static toggle(key: string, handler: () => void): void {
    //
    //     const currentValue =
    //         Optional.of(window.localStorage.getItem(key)).getOrElse('false');
    //
    //     if (currentValue === 'true') {
    //         return;
    //     }
    //
    //     handler();
    //
    //     this.mark(key);
    //
    // }

}
