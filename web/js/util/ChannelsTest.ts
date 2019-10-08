import {Channels} from "./Channels";
import {assert} from 'chai';

describe('Channels', function() {

    it('should call', function() {

        const [channel, setChannel] = Channels.create<string>();

        // make sure we can call it with no op now...
        channel('yo');

        let message: string | undefined;

        assert.equal(message, undefined);
        channel('hey');

        setChannel((value) => message = value);

        channel('sup');

        assert.equal(message, 'sup');

    });

});
