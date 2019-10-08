import {StartableService, StoppableService} from './Service';
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

export class Services {

    public static async start(...services: StartableService[]) {

        const promises: Promise<any>[] = [];

        services.forEach(service => {
            log.info("Starting service: " + service.constructor.name);
            promises.push(service.start());
        });

        await Promise.all(promises)

    }

    static stop(serviceReferences: {[name: string]: StoppableService}): void {

        Object.entries(serviceReferences).forEach(serviceReference => {

            let name = serviceReference[0];
            let service = serviceReference[1];

            let message = `Stopping service ${name}...`;

            log.info(message);

            service.stop();

            log.info(message + "done");

        });

    }

}
