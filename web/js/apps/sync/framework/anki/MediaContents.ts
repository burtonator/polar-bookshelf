import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {MediaFile} from './clients/StoreMediaFileClient';
import {MediaContent} from './MediaContent';

export class MediaContents {

    public static parse(content: string): MediaContent {

        const mediaFiles: MediaFile[] = [];

        const re = /src=["'](data:image\/(gif|jpg|png);base64,[^"']+)/g;

        content = content.replace(re, (match, p1) => {

            const mediaFile = MediaContents.toMediaFile(p1);

            mediaFiles.push(mediaFile.get());

            return match.replace(p1, mediaFile.get().filename);

        });

        return {
            content, mediaFiles
        };

    }

    public static toMediaFile(dataURL: string): Optional<MediaFile> {

        const re = /data:image\/(gif|jpg|png);base64,([^"']+)/;
        const m = re.exec(dataURL);

        if (m) {

            const type = m[1];
            const data = m[2];

            const name = Hashcodes.createID(data, 20);
            const filename = `${name}.${type}`;

            return Optional.of({filename, data});

        }

        return Optional.empty();

    }

}
