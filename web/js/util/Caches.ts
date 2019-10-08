
export class Caches {

    // some beta/preliminary code to create a response from a fake URL which we
    // could use to tie together fake streams..
    public static async toResponse(url: string) {

        const cache = await caches.open('my-cache');

        const stream = new ReadableStream({

            start(controller) {

                controller.enqueue("hello world");
                controller.close();
            }

        });

        const response = new Response(stream, {
            headers: {'content-type': 'text/html'}
        });

        // await cache.put(url, response);

    }

}
