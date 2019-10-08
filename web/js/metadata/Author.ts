import {SerializedObject} from './SerializedObject';
import {ProfileIDStr} from "../datastore/sharing/db/Profiles";
import {AuthorImage, IAuthor} from "polar-shared/src/metadata/IAuthor";

export class Author extends SerializedObject implements IAuthor {

    public readonly name: string = "";

    public readonly profileID: ProfileIDStr;

    public readonly url?: string;

    public readonly image?: AuthorImage;

    // TODO: I don't like this so we should find an alternative way to
    // represent this....
    public readonly guest?: boolean;

    constructor(val: IAuthor) {
        super(<any> val);
        this.name = val.name;
        this.profileID = val.profileID;
        this.url = val.url;
        this.image = val.image;
        this.guest = val.guest;
    }

}

