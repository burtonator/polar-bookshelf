import {ModelNamesClient} from "./clients/ModelNamesClient";
import {SetArrays} from "polar-shared/src/util/SetArrays";

export class ModelNames {

    public static verifyRequired(modelNames: ReadonlyArray<string>) {

        const requiredModelNames = ["Cloze", "Basic"];

        const diff = SetArrays.difference(requiredModelNames, modelNames);

        if (diff.length !== 0) {
            
            const msg = "Missing the following required Anki models (the names " +
                        "may be in another language.  Copy them to English card " +
                        "names for now): ";
            
            throw new Error(msg + diff);
            
        }

    }

}

