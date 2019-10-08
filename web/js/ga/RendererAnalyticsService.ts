import {CIDProvider} from "./CIDProvider";

declare var global: any;

/**
 * @ElectronMainContext
 */
export class RendererAnalyticsService {

    public start(): void {

        global.cidProvider = new CIDProvider(undefined);

    }

}
