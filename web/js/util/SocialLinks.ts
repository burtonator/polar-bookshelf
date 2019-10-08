/**
 * Create links to share content on various platforms like Facebook, Twitter,
 * and GMail etc.
 */
import {URLStr} from "polar-shared/src/util/Strings";

export class SocialLinks {

    public static createForGMail(link: string, description?: string): URLStr {

        const body = encodeURIComponent(this.createBodyText(link, description));

        return `https://mail.google.com/mail/u/0/?view=cm&ui=2&cmid=0&fs=1&tf=1&body=${body}`;

    }

    public static createForTwitter(link: string, description?: string): URLStr {

        const body = encodeURIComponent(this.createBodyText(link, description));

        return `https://twitter.com/intent/tweet?text=${body}&source=webclient`;

    }

    public static createForFacebook(link: string, description?: string) {

        const u = encodeURIComponent(link);
        const t = encodeURIComponent(description || "");

        return `https://www.facebook.com/share.php?u=${u}&t=${t}`;

    }

    private static createBodyText(link: string, description?: string) {

        if (description) {
            return description + "\n\n"  + link;
        }

        return link;

    }

}
