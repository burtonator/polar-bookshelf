import {ToasterMessageType, ToasterOptions} from "./Toaster";

export interface ToasterMessage {
    readonly type: ToasterMessageType;
    readonly message: string;
    readonly title?: string;
    readonly options?: ToasterOptions;
}
