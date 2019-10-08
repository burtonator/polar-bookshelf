import {PDFMetadata} from "polar-pdf/src/pdf/PDFMetadata";
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {PDFImporter} from '../web/js/apps/repository/importers/PDFImporter';

// code that prints PDF metadata frmo files given on the command line.

class Main {

    public static async main() {

        for (const path of process.argv.slice(2)) {
            console.log("====");
            console.log("Fetching PDF metadata for: " + FilePaths.resolve(path));
            const metadata = await PDFMetadata.getMetadata(path);
            const hashcode = await PDFImporter.computeHashcode(path);
            console.log("fingerprint: " + metadata.fingerprint);
            console.log("nr pages: " + metadata.nrPages);
            console.log("hashcode: " + JSON.stringify(hashcode, null, "  "));
        }

    }

}

Main.main()
    .catch(err => console.error("Failure to process PDF meta: ", err));
