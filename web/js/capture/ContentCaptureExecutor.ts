import {IResult} from '../util/Result';
import {Results} from '../util/Results';
import {Filenames} from '../util/Filenames';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {CapturedPHZWriter} from './CapturedPHZWriter';
import {Logger} from 'polar-shared/src/logger/Logger';
import {BrowserProfile} from './BrowserProfile';
import WebContents = Electron.WebContents;
import {Directories} from '../datastore/Directories';
import {CaptureResult} from './CaptureResult';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {Captured} from './renderer/Captured';

const log = Logger.create();

const MAX_TITLE_LENGTH = 50;

export class ContentCaptureExecutor {

    private static directories = new Directories();

    public static async execute(webContents: WebContents, browserProfile: BrowserProfile): Promise<CaptureResult> {

        // TODO: this function should be cleaned up a bit.. it has too many moving
        // parts now and should be moved into smaller functions.

        log.info("Capturing the HTML...");

        let captured;

        // TODO: I don't think executeJavascript actually handles exceptions
        // properly and they also suggest using the callback so we should test
        // this more aggressively.
        try {

            const result: IResult<Captured> = await webContents.executeJavaScript("ContentCapture.execute()");
            captured = Results.create<Captured>(result).get();

        } catch (e) {

            // TODO: this isn't actually called because executeJavascript doesn't
            // handle exceptions. You just block there forever. I need to wrap
            // this with a closure that is an 'either' err or content.

            log.error("Could not capture HTML: ", e);
            throw e;
        }

        // record the browser that was used to render this page.
        captured.browser = browserProfile;

        const url = captured.url;

        const title = (captured.title || "").substring(0, MAX_TITLE_LENGTH);

        const hash = Hashcodes.createID(url);
        const stashDir = this.directories.stashDir;
        const filename = hash + '-' + Filenames.sanitize(title);

        const phzPath = FilePaths.join(stashDir, filename) + '.phz';

        log.info("Writing PHZ to: " + phzPath);

        const capturedPHZWriter = new CapturedPHZWriter(phzPath);
        await capturedPHZWriter.convert(captured);

        // write the captured HTML to /tmp for debug purposes.  We can enable this
        // as a command line switch later.

        // await Files.writeFileAsync(`/tmp/${filename}.json`, JSON.stringify(captured, null, "  "));

        log.info("Capturing the HTML...done");

        return {
            path: phzPath
        };

    }

}
