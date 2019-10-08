import {AnnotationHolder} from "../AnnotationHolder";
import {TextHighlight} from "../TextHighlight";
import {AreaHighlight} from '../AreaHighlight';
import {AbstractExporter} from './AbstractExporter';
import {Flashcard} from '../Flashcard';
import {Comment} from '../Comment';
import {Texts} from "../Texts";
import {IPageInfo} from "polar-shared/src/metadata/IPageInfo";
import {FileRef} from "polar-shared/src/datastore/FileRef";

export class MarkdownExporter extends AbstractExporter {

    public readonly id: string = 'markdown';

    protected pageInfoToText(pageInfo?: IPageInfo): string {

        if (!pageInfo) {
            return "";
        }

        return `page: ${pageInfo.num}\n`;
    }

    protected async writeImage(highlight: AreaHighlight | TextHighlight) {

        if (highlight.image) {

            const backend = highlight.image.src.backend;
            const fileRef: FileRef = highlight.image.src;

            const containsFile = await this.datastore!.containsFile(backend, fileRef);

            if (containsFile) {

                const file = this.datastore!.getFile(backend, fileRef);

                await this.writer!.write(`image: ${file.url}\n`);

            }

        }

    }

    protected async writeAreaHighlight(areaHighlight: AreaHighlight, exportable: AnnotationHolder): Promise<void> {
        await this.writer!.write("---\n");

        const output =
            `type: area-highlight\n` +
            `created: ${areaHighlight.created}\n` +
            `color: ${areaHighlight.color || ''}\n`
        ;

        await this.writer!.write(output);
        await this.writeImage(areaHighlight);

    }

    protected async writeTextHighlight(textHighlight: TextHighlight, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write("---\n");

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        const output =
            `type: text-highlight\n` +
            `created: ${textHighlight.created}\n` +
            `color: ${textHighlight.color || ''}\n`
        ;

        await this.writer!.write(output);

        await this.writeImage(textHighlight);

        const body = Texts.toString(textHighlight.text);

        if (body) {
            await this.writer!.write(body);
            await this.writer!.write('\n');
        }

    }

    protected async writeComment(comment: Comment, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write("---\n");

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        const output =
            `type: comment\n` +
            `created: ${comment.created}\n`
        ;

        await this.writer!.write(output);

        const body = Texts.toString(comment.content);

        if (body) {
            await this.writer!.write(body);
            await this.writer!.write('\n');
        }

    }

    protected async writeFlashcard(flashcard: Flashcard, exportable: AnnotationHolder): Promise<void> {

        await this.writer!.write(this.pageInfoToText(exportable.pageInfo));

        for (const fieldName of Object.keys(flashcard.fields)) {

            const output =
                `type: flashcard\n` +
                `created: ${flashcard.created}\n`
            ;

            await this.writer!.write(output);

            const field = flashcard.fields[fieldName];

            await this.writer!.write(`${fieldName}: ` + Texts.toString(field));
            await this.writer!.write('\n');

        }

    }

}
