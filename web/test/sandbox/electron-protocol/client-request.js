
const r = require('request');
const zlib = require('zlib');
const stream = require('stream')

const electron = require('electron');
const app = electron.app;
const protocol = electron.protocol;
/** @type {Electron.Net} */
const net = electron.net;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', async function() {

    // // try to make a ClientRequest now...
    // let clientRequest = new ClientRequest();

    const request = net.request('https://httpbin.org/gzip');

    console.log(request);
    console.log(request.setHeader);

    request.on('response', (response) => {
        // console.log(`STATUS: ${response.statusCode}`)
        // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
        response.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`)
        })
        response.on('end', () => {
            console.log('No more data in response.')
        })
    })
    request.end()

});

