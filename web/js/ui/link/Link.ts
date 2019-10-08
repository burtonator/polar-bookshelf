export class Link {

    public readonly rel: string;

    public readonly href: string;

    public readonly id: string;

    public readonly doc: Document = document;

    constructor(rel: string, href: string, id: string, doc?: Document) {

        this.rel = rel;
        this.href = href;
        this.id = id;

        if (doc) {
            this.doc = doc;
        } else {
            this.doc = document;
        }

    }

    present(): void {

        if (this.doc.head!.querySelector("#" + this.id)) {
            // it's already present.
            return;
        }

        let link = this.doc.createElement("link");

        link.rel = this.rel;
        link.href = this.href;
        link.id = this.id;

        this.doc.head!.appendChild(link);

    }

    absent(): void {

        let link = this.doc.head!.querySelector("#" + this.id);

        if (! link) {
            // it's already present.
            return;
        }

        if (link.parentElement) {
            link.parentElement.removeChild(link);
        }

    }

}
