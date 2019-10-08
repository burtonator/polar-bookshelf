import {Exporter, Writable} from "./Exporters";
import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {Comment} from '../Comment';
import {Flashcard} from '../Flashcard';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import { ReadableBinaryDatastore } from "../../datastore/Datastore";

export abstract class AbstractExporter implements Exporter {

    public abstract readonly id: string;

    protected writer?: Writable;
    protected datastore?: ReadableBinaryDatastore;

    public async init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void> {
        this.writer = writer;
        this.datastore = datastore;
    }

    public async write(exportable: AnnotationHolder): Promise<void> {

        switch (exportable.type) {

            case AnnotationType.TEXT_HIGHLIGHT:
                await this.writeTextHighlight(<TextHighlight> exportable.annotation, exportable);
                break;

            case AnnotationType.AREA_HIGHLIGHT:
                await this.writeAreaHighlight(<AreaHighlight> exportable.annotation, exportable);
                break;

            case AnnotationType.COMMENT:
                await this.writeComment(<Comment> exportable.annotation, exportable);
                break;

            case AnnotationType.FLASHCARD:
                await this.writeFlashcard(<Flashcard> exportable.annotation, exportable);
                break;

        }

    }

    protected abstract writeTextHighlight(textHighlight: TextHighlight,
                                          exportable: AnnotationHolder): Promise<void>;

    protected abstract writeAreaHighlight(areaHighlight: AreaHighlight,
                                          exportable: AnnotationHolder): Promise<void>;

    protected abstract writeComment(comment: Comment,
                                    exportable: AnnotationHolder): Promise<void>;

    protected abstract writeFlashcard(flashcard: Flashcard,
                                      exportable: AnnotationHolder): Promise<void>;

    public async close(err?: Error): Promise<void> {

        // noop

    }

}
