import {BaseDocAnnotation} from "./BaseDocAnnotation";
import {ProfileIDStr} from "../Profiles";

export interface ProfileDocAnnotation extends BaseDocAnnotation {
    readonly profileID: ProfileIDStr;
}
