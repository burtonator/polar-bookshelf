export class CloudFunctions {

    public static createEndpoint() {
        const project = process.env.POLAR_TEST_PROJECT || "polar-cors";
        return `https://us-central1-${project}.cloudfunctions.net`;
    }

}
