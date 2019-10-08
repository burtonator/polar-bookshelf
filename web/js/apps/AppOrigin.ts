
export class AppOrigin {

    public static configure() {

        if (document && document.location && document.location.href) {

            const href = document.location.href;
            if (href.indexOf('getpolarized.io') !== -1) {
                document.domain = 'getpolarized.io';
            }

        }

    }

}
