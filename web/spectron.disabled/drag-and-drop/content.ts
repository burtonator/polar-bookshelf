import {SpectronRenderer} from '../../js/test/SpectronRenderer';

function onDragEnterOrOver(event: DragEvent) {
    // needed to tell the browser that onDrop is supported here...
    event.preventDefault();
}

function onDrop(event: DragEvent) {

    console.log("drop: ", event);

    console.log("drop: NR files", event.dataTransfer!.files.length);
    console.log("drop: NR items", event.dataTransfer!.items.length);

    for (const file of Array.from(event.dataTransfer!.files)) {
        console.log("FIXME: ", file);
        console.log("FIXME: " + file.path);
    }

    for (const item of Array.from(event.dataTransfer!.items)) {
        console.log("FIXME: dataTransferItem: ", item);
        // item.get
    }

    if (event.dataTransfer!.effectAllowed === 'copyLink') {

        const link = event.dataTransfer!.getData('text/plain');

        console.log("FIXME: link ", link);

        console.log("FIXME0: ", event.dataTransfer!.getData('text/plain'));
        console.log("FIXME1: ", event.dataTransfer!.getData('text/html'));
        console.log("FIXME2: ", event.dataTransfer!.getData('URL'));

    }

    // FIXME: dragged HTML has type of text/html and 'kind' of 'string
    //
    // We could parse that HTML , then extract the links with titles, and write
    // docs for them that are pre-rendered... but right now we don't ahve a way
    // to start capture OTHER than the menu.  In order to do this we need to have a
    // ContentCaptureService and a ContentCaptureClient to trigger one from the
    // renderer...

}

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");
    // you can also update the result in the renderer
    // state.testResultWriter.write(true);

    document.body.addEventListener('drop', event => onDrop(event));

    document.body.addEventListener('dragover', event => {
        console.log("dragover: ", event);
    });

    document.body.addEventListener('dragenter', (event) => onDragEnterOrOver(event));
    document.body.addEventListener('dragover', (event) => onDragEnterOrOver(event));

});


