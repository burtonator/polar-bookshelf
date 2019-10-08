import {Reactor} from './Reactor';
import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';

describe('Reactor', function() {

    it("With multiple args", function () {

        let reactor = new Reactor<MessageEvent>();

        let messageEvent: MessageEvent = {
            message: 'hello world'
        };

        let events: MessageEvent[] = [];

        assert.notEqual(reactor.registerEvent("hello"), undefined);

        reactor.addEventListener("hello", (messageEvent) => {
            events.push(messageEvent);
        });

        reactor.dispatchEvent("hello", messageEvent);

        assertJSON(events, [
            {
                "message": "hello world"
            }
        ]);

    });

    it("ordering", function() {

        const reactor = new Reactor<string>();

        const sources: string[] = [];

        assert.notEqual(reactor.registerEvent("messages"), undefined);

        reactor.addEventListener("messages", (messageEvent) => {
            console.log('first');
        });

        reactor.addEventListener("messages", (messageEvent) => {
            console.log('second');
        });

        reactor.dispatchEvent("messages", 'hello');

    });


    it("removeEventListener", function() {

        const reactor = new Reactor<string>();

        const eventName = "messages";
        assert.notEqual(reactor.registerEvent(eventName), undefined);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

        const listener = (messageEvent: string) => {
            console.log('first');
        };

        reactor.addEventListener(eventName, listener);

        assert.equal(reactor.getEventListeners(eventName).length, 1);

        assert.equal(reactor.removeEventListener(eventName, listener), true);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

    });


    it("removeEventListener from addEventListener", function() {

        const reactor = new Reactor<string>();

        const eventName = "messages";
        reactor.registerEvent(eventName);

        const registeredEventListener = reactor.addEventListener(eventName, message => {});

        assert.equal(reactor.getEventListeners(eventName).length, 1);

        assert.equal(reactor.removeEventListener(eventName, registeredEventListener.eventListener), true);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

    });


    it("once", async function() {

        const reactor = new Reactor<string>();

        const eventName = "messages";
        assert.notEqual(reactor.registerEvent(eventName), undefined);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

        const messagePromise = reactor.once(eventName);
        assert.equal(reactor.getEventListeners(eventName).length, 1);

        reactor.dispatchEvent(eventName, 'hello');
        reactor.dispatchEvent(eventName, 'world');

        const message = await messagePromise;

        assert.equal(message, 'hello');

        assert.equal(reactor.getEventListeners(eventName).length, 0);

    });


});

interface MessageEvent {
    readonly message: string;
}
