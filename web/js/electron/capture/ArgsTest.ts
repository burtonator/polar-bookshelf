import {assert} from 'chai';
import {assertJSON} from '../../test/Assertions';
import {Args} from './Args';

describe('Args', function() {

    describe('parse', function() {

        it("no args", function () {

            assertJSON(Args.parse([]), {
                    "quit": true,
                    "browser": "DEFAULT",
                    "profile": "WEBVIEW",
                    "amp": true
                }
            );

        });

        it("change browser", function () {
            assertJSON(Args.parse(["--browser=TEST_BROWSER"]), {
                "browser": "TEST_BROWSER",
                "quit": true,
                "profile": "WEBVIEW",
                "amp": true
            });
        });

    });

});
