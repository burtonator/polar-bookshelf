import {remote} from 'electron';
import {CIDProvider} from './CIDProvider';
import {Logger} from 'polar-shared/src/logger/Logger';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Providers} from 'polar-shared/src/util/Providers';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class CIDProviders {

    public static getInstance(): CIDProvider | null {

        if (remote) {
            return remote.getGlobal('cidProvider');
        } else {
            return Optional.of(window.localStorage.getItem('cidProvider'))
                .map(value => new CIDProvider(value))
                .getOrNull();
        }

    }

    public static setInstance(provider: CIDProvider) {

        if (remote) {

            Preconditions.assertPresent(provider, "provider");

            if (! isPresent(remote.getGlobal('cidProvider'))) {
                log.warn("No global cid provider in remote");
                // note that we can't track anything at this point but we might
                // be in a testing framework which hasn't defined the variable
                // we need within main.
                return;
            }

            remote.getGlobal('cidProvider').value = provider.get();

        } else {

            const value = provider.get();

            if (value) {
                window.localStorage.setItem('cidProvider', value);
            }

        }

    }

}
