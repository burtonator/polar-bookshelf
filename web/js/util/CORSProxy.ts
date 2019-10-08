import {encode} from 'punycode';

export class CORSProxy {

    /**
     * Create a proxy URL which adds CORS headers to allow us to download it
     * from within the Polar webapp.
     *
     * @param targetURL
     */
    public static createProxyURL(targetURL: string) {

        // TODO: is it possible to make this use the CDN so we have one in
        // every datacenter?

        return "https://us-central1-polar-cors.cloudfunctions.net/cors?url=" + encodeURIComponent(targetURL);

    }

}
