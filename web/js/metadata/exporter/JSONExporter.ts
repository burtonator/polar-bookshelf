import {Writable} from "./Exporters";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExporter} from './AbstractExporter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Texts} from "../Texts";
import {Strings} from "polar-shared/src/util/Strings";
import {ReadableBinaryDatastore} from "../../datastore/Datastore";

export class JSONExporter extends AbstractExporter {

    public readonly id: string = 'json';

    private hasItem: boolean = false;

    public async init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void> {
        await super.init(writer, datastore);

        await writer.write("{\n");
        await writer.write("  \"version\": 1,\n");
        await writer.write("  \"items\": [\n");

    }

    private async onItem() {

        if (this.hasItem) {
            await this.writer!.write(",\n");
        }

        this.hasItem = true;

    }

    protected async writeAreaHighlight(areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(areaHighlight));
    }

    protected async writeTextHighlight(textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(textHighlight));
    }

    protected async writeComment(comment: Comment, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(comment));
    }

    protected async writeFlashcard(flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {
        await this.onItem();
        await this.writer!.write(this.toRecord(Flashcard));
    }

    public async close(err?: Error): Promise<void> {

        await this.writer!.write("\n  ]\n");
        await this.writer!.write("\n}\n");

        return super.close(err);
    }

    private toRecord(obj: any) {
        return Strings.indent(JSON.stringify(obj, null, "  "), "    ");
    }

}
