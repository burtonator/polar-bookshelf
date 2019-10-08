
export interface Image {
    readonly url: string;
    readonly size: Size | null;
}

export interface Size {
    readonly width: number;
    readonly height: number;
}
