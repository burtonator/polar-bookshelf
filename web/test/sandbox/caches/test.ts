
async function doTest() {

    const cache = await caches.open('my-cache');

    // const stream = new ReadableStream({
    //
    //     start(controller) {
    //
    //         controller.enqueue("hello world");
    //         controller.close();
    //     }
    //
    // });

    // const response = new Response(stream, {
    //     headers: {'content-type': 'text/html'}
    // });

    // const url = './test.txt';
    // await cache.put(url, response);

}

