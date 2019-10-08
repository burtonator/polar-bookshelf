export class URLParams {

    /**
     * Create a JSON encoded param.
     */
    public static createJSON(obj: any) {
        return encodeURIComponent(JSON.stringify(obj));
    }

}
