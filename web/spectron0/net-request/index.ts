import {SpectronMain2} from '../../js/test/SpectronMain2';
import {net} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';

const log = Logger.create();

SpectronMain2.create().run(async state => {


    const options = {
        method: "GET",
        url: 'https://www.cnn.com',
    };

    const netRequest = net.request(options)
        .on('response', async (response) => {

            response.on('data', chunk => {
                console.log("GOT CHUNK:", chunk);
            });

            response.on('end', () => {
                console.log("GOT END");
            });

        })
        .on('abort', () => {
            log.error(`Request aborted: ${options.url}`);
        })
        .on('error', (error) => {
            log.error(`Request error: ${options.url}`, error);
        });


    // TODO: we have to call netRequest.write on all the request.uploadData.
    // not urgent because this isn't really a use case we must support.

    netRequest.end();




    await state.testResultWriter.write(true);

});
