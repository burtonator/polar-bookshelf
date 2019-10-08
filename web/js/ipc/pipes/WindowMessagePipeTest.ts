import {assert} from 'chai';
import {JSDOM} from 'jsdom';
import {WindowMessagePipe} from './WindowMessagePipe';
import {assertJSON} from '../../test/Assertions';

declare var global: any;

describe('WindowMessagePipe', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("Basic post message", async function () {

        const dom = new JSDOM("<html></html>");

        global.window = dom.window;

        assert.notEqual(global.window, null);

        const windowMessagePipe = new WindowMessagePipe();

        const messagePromise = windowMessagePipe.when('/hello');

        const message = {
            channel: '/hello',
            message: 'hello world'
        };

        window.postMessage(message, '*');

        const pipeNotification = await messagePromise;
        assert.equal(pipeNotification.channel, '/hello');
        assert.equal(pipeNotification.message, 'hello world');

    });

});
