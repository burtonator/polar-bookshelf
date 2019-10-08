import {CacheRegistry} from '../proxyserver/CacheRegistry';
import {Logger} from 'polar-shared/src/logger/Logger';
import {CachingStreamInterceptor} from './CachingStreamInterceptor';
import {Protocols} from './Protocols';
import {StreamInterceptors} from './StreamInterceptors';
import {CacheStats} from './CacheStats';

const log = Logger.create();

export class CachingStreamInterceptorService {

    public readonly cacheStats = new CacheStats();

    private readonly cacheRegistry: CacheRegistry;

    private cachingStreamInterceptor: CachingStreamInterceptor;
    private protocol: Electron.Protocol;

    constructor(cacheRegistry: CacheRegistry, protocol: Electron.Protocol) {
        this.cacheRegistry = cacheRegistry;
        this.protocol = protocol;
        this.cachingStreamInterceptor = new CachingStreamInterceptor(cacheRegistry, this.cacheStats);
    }

    public async start() {

        log.debug("Starting service and registering protocol interceptors.");

        for (const scheme of ['http', 'https']) {

            await Protocols.interceptStreamProtocol(this.protocol, scheme, (request, callback) => {

                StreamInterceptors.withSetTimeout(() => {
                    this.cachingStreamInterceptor.intercept(request, callback);
                });

            });

        }

    }

    public async stop() {
        throw new Error("not implemented");
    }

}
