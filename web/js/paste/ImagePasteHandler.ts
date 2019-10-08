export class ImagePasteHandler {

    private element: any;
    private mutator: any;

    constructor(element: any, mutator: any) {

        this.element = element;
        this.mutator = mutator;

        if( ! this.mutator) {
            this.mutator = function (val: any) {
                return val;
            };
        }

    }

    start() {

        this.element.addEventListener("paste", async function (event: any) {

            let imagePasted = await ImagePasteHandler.handlePasteData(event);

            if (imagePasted.image) {

                // cancel paste so we can handle it ourselves.
                event.preventDefault();

                // get text representation of clipboard
                //let text = e.clipboardData.getData("text/plain");

                let text = imagePasted.image;
                text = this.mutator(text);

                // insert text manually
                document.execCommand("insertHTML", false, text);

                return true;

            }

            // this is just true so we can continue;
            return true;

        }.bind(this));

    };

    /**
     * Handle pasted data and convert to a data: URL when necessary
     */
    static handlePasteData(e: any): Promise<any> {

        // call .originalEvent if running with jquery.
        let orgEvent = e;

        for (let i = 0; i < orgEvent.clipboardData.items.length; i++) {

            let clipboardDataItem = orgEvent.clipboardData.items[i];
            if (clipboardDataItem.kind === "file" && clipboardDataItem.type === "image/png") {

                let imageFile = clipboardDataItem.getAsFile();
                let fileReader = new FileReader();

                return new Promise(function(resolve, reject) {

                    fileReader.onloadend = function () {
                        resolve({image: fileReader.result});
                    };

                    fileReader.readAsDataURL(imageFile);

                });

            }

        }

        return new Promise(function (resolve) {
            resolve({});
        })

    }

};
