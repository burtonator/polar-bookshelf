export class EmailAddressParser {

    // https://stackoverflow.com/questions/14440444/extract-all-email-addresses-from-bulk-text-using-jquery

    public static parse(text: string): ReadonlyArray<EmailAddress> {

        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

        let m: RegExpExecArray | null = null;

        const result: string[] = [];

        do {

            m = re.exec(text);

            if (m) {
                result.push(m[0]);
            }

        } while (m);

        return result;

    }

}

export type EmailAddress = string;
