import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {URLStr} from "polar-shared/src/util/Strings";
import PDFJS from 'pdfjs-dist';
import {Numbers} from "polar-shared/src/util/Numbers";

console.log("Running with pdf.js version: " + PDFJS.version);

// TODO: I'm not sure this is the safest way to find the worker path.
PDFJS.GlobalWorkerOptions.workerSrc = '../../../node_modules/pdfjs-dist/build/pdf.worker.js';

const log = Logger.create();

console.log("FIXME: ", (PDFJS as any).renderTextLayer);

export class PDFViewer extends React.Component<IProps, IState> {

    // https://mozilla.github.io/pdf.js/examples/
    constructor(props: IProps, context: any) {
        super(props, context);

        this.doRender = this.doRender.bind(this);

        this.state = {

        };

        this.doRender().catch(err => log.error(err));

    }

    private async doRender() {

        // https://github.com/mozilla/pdf.js/tree/master/web

        // https://github.com/mozilla/pdf.js/blob/master/src/pdf.js

        // https://github.com/mozilla/pdf.js/blob/master/web/viewer.js
        // https://github.com/mozilla/pdf.js/blob/master/web/app.js
        // https://github.com/mozilla/pdf.js/blob/master/web/base_viewer.js
        // https://github.com/mozilla/pdf.js/blob/master/web/pdf_outline_viewer.js
        // https://github.com/mozilla/pdf.js/blob/master/web/pdf_thumbnail_viewer.js
        // https://github.com/mozilla/pdf.js/blob/master/web/pdf_viewer.js

        // TODO: determine the primary page that the user is viewing and only render N +- 10 pages
        //
        // FIXME: rendering the text layer is VERY confusing but we need to do it.  What's happening
        // is that there's a missing symbol exported I think as not all symbols are exported in
        // pdf.js but the aren't in the typescript definitions and the interfaces don't match up.
        //
        // further, the viewer seems to be designed around the pdfjs lib and vice versa so it's not
        // clear how to use it properly.
        //
        // https://stackoverflow.com/questions/33063213/pdf-js-with-text-selection
        //
        // this is probably the closet we are going to get to being able to build this.

        // this is the best example It hink.
        // https://github.com/mozilla/pdf.js/blob/master/examples/components/pageviewer.js#L55

        // TODO: use the same CSS elements and classes
        //
        // TODO: sidebar
        //
        // TODO: zoom in / out and page width , page height.

        // TODO: search UI to search within the document

        // TODO: center + change page height when the browser reloads

        // TODO: when the component is unloaded we need to release the resources

        const loadingTask = PDFJS.getDocument('../../../docs/examples/pdf/bigtable.pdf');

        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        var scale = 1;
        var viewport = page.getViewport({ scale: scale});

        const canvas = document.querySelector('#pdf canvas') as HTMLCanvasElement | null;
        const textLayer = document.querySelector('#pdf .textLayer') as HTMLDivElement | null;

        if (! canvas) {
            throw new Error("No canvas");
        }

        if (! textLayer) {
            throw new Error("No textLayer");
        }

        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // FIXME: I don't know how this should be implemented... do I need an imageLayer?

        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            // textLayer
        };

        page.render(renderContext);

    }

    public render() {


        const RenderPages = () => {

            const nrPages = this.state.nrPages || 1;
            const range = Numbers.range(1, nrPages);

            return <div>
                {range.map(page =>
                    <div className="page" data-page-num={page} key={page}>
                        <div className="canvasWrapper">
                            <canvas/>
                        </div>
                        <div className="textLayer">

                        </div>
                    </div>)}
            </div>

        };

        return (

            <div id="pdf">
                <RenderPages/>
            </div>

        );

    }

}

export interface IProps {
    readonly src: URLStr;
}

interface IState {
    readonly nrPages?: number;
}

