import {AnnotationHolder} from '../AnnotationHolder';
import {FileWriter} from './writers/FileWriter';
import {MarkdownExporter} from './MarkdownExporter';
import {JSONExporter} from './JSONExporter';
import {DocMeta} from '../DocMeta';
import {AnnotationHolders} from '../AnnotationHolders';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {ReadableBinaryDatastore} from "../../datastore/Datastore";

/**
 * Exporter provides a mechanism to write data from the internal Polar JSON
 * object schema to an external source. This includes writing to a file, the
 * clipboard, perhaps Twitter, email, etc.
 *
 * The exporter takes a ExportFormat (html, markdown, etc) and a target.
 *
 *
 */
export class Exporters {

    public static async doExport(path: string,
                                 datastore: ReadableBinaryDatastore,
                                 format: ExportFormat,
                                 docMeta: IDocMeta): Promise<void> {

        const writer = new FileWriter(path);

        await writer.init();

        // create the exporter (markdown, html, etc)
        const exporter = this.toExporter(format);

        await exporter.init(writer, datastore);

        const annotationHolders = [...AnnotationHolders.fromDocMeta(docMeta)]
            .sort((a, b) => a.annotation.created.localeCompare(b.annotation.created));

        for (const annotationHolder of annotationHolders) {
            await exporter.write(annotationHolder);
        }

        await exporter.close();

    }

    private static toExporter(format: ExportFormat) {

        switch (format) {

            case 'markdown':
                return new MarkdownExporter();

            case 'json':
                return new JSONExporter();

            case 'html':
                throw new Error("not supported yet");

        }

    }

}

/**
 *
 */
export interface Exporter {

    readonly id: string;

    init(writer: Writable, datastore: ReadableBinaryDatastore): Promise<void>;

    write(exportable: AnnotationHolder): Promise<void>;

    close(err?: Error): Promise<void>;

}

export interface Writable {

    write(data: string): Promise<void>;

}

/**
 * Handles writing data to a given output channel.  This could be a file,
 * socket, stream, clipboard, etc.
 *
 * The caller must call init() , then any writes, then endExport().
 *
 * This way if the exporter is something like a clipboard , or something
 * non-streaming then it can buffer the data and send on endExport but if it's
 * streaming then we can just flush on each write then handle releasing
 * resources on endExport.
 *
 */
export interface Writer extends Writable {

    init(): Promise<void>;

    write(data: string): Promise<void>;

    /**
     * Close the exporter.  Pass err if any error was encountered while writing
     * as we might wish to abort the export if an error was encountered but
     * still release resources.
     *
     * @param err
     */
    close(err?: Error): Promise<void>;

}

/**
 * A supplier that provides an exportable when called. We use a supplier to
 * avoid having to keep everything in memory during an export.
 */
export type ExportableSupplier = () => Promise<ReadonlyArray<AnnotationHolder>>;

export type ExportFormat = 'html' | 'markdown' | 'json';
