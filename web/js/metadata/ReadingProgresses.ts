import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {ProgressByMode, ReadingProgress} from 'polar-shared/src/metadata/ReadingProgress';
import {Preconditions} from 'polar-shared/src/Preconditions';


export class ReadingProgresses {

    public static sequences = {
        id: 0,
    };

    public static create(progress: number,
                         progressByMode: ProgressByMode,
                         preExisting?: boolean): ReadingProgress {

        Preconditions.assert(progress,
                             () => progress >= 0 && progress <= 100,
                             "Progress value invalid. Must be within interval [0-100]");

        const created = ISODateTimeStrings.create();

        const id = Hashcodes.createID({nonce: this.sequences.id++, created});

        return {id, created, progress, progressByMode, preExisting};

    }

}
