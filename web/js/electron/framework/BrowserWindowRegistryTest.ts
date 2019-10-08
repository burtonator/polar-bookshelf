
import * as assert from 'assert';
import {BrowserWindowRegistry, ID, LiveWindowsProvider} from './BrowserWindowRegistry';
import {assertJSON} from '../../test/Assertions';
import {isPresent} from 'polar-shared/src/Preconditions';

describe('BrowserWindowRegistry', function() {

    class MockLiveWindowsProvider implements LiveWindowsProvider {

        result: ID[] = [];

        getLiveWindowIDs(): ID[] {
            return this.result;
        }

    }

    it("make sure GC works", async function() {

        const mockLiveWindowsProvider = new MockLiveWindowsProvider();

        mockLiveWindowsProvider.result = [1];

        (<any> BrowserWindowRegistry).liveWindowsProvider = mockLiveWindowsProvider;

        assert.deepStrictEqual(BrowserWindowRegistry.gc(), []);

        BrowserWindowRegistry.tag(1, {'name': 'test'});

        assert.deepStrictEqual(BrowserWindowRegistry.gc(), []);

        mockLiveWindowsProvider.result = [];

        assert.deepStrictEqual(BrowserWindowRegistry.gc(), [1]);

    });


    it("basic tagging", async function() {

        const mockLiveWindowsProvider = new MockLiveWindowsProvider();

        mockLiveWindowsProvider.result = [1];

        (<any> BrowserWindowRegistry).liveWindowsProvider = mockLiveWindowsProvider;

        BrowserWindowRegistry.tag(1, {name: 'test'});

        const expected = {
            "tags": {
                "name": "test"
            }
        };

        assert.ok(isPresent(BrowserWindowRegistry.get(1)));

        assertJSON(BrowserWindowRegistry.get(1), expected);

        assertJSON(BrowserWindowRegistry.tagged({name: 'name', value: 'test'}), [1]);

    });

});

