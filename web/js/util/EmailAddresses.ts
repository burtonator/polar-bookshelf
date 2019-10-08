
import {parseAddressList} from 'email-addresses';
import ParsedMailbox = emailAddresses.ParsedMailbox;
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {isPresent} from 'polar-shared/src/Preconditions';

/**
 * This is an RFC 5322 parser.
 */
export class EmailAddresses {

    public static parseList(input: string) {

        input = input.replace(/[\r\n]/g, "");

        const parsed = parseAddressList(input);

        if (! isPresent(parsed)) {
            return [];
        }

        const result: EmailAddress[] = [];

        for (const current of parsed) {

            if (current.type === 'mailbox') {
                const parsedMailbox = <ParsedMailbox> <any> current;
                const name = Optional.of(parsedMailbox.name).getOrUndefined();
                const address = parsedMailbox.address;
                result.push({name, address});
            }

        }

        return result;

    }

    public static format(addr: EmailAddress) {

        if (addr.name) {
            return `"${addr.name}" <${addr.address}>`;
        }

        return addr.address;

    }

}

export interface EmailAddress {
    readonly name?: string;
    readonly address: string;
}
