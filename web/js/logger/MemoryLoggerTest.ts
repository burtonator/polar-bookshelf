import {MemoryLogger} from "./MemoryLogger";
import {assertJSON} from "../test/Assertions";
import {TestingTime} from '../test/TestingTime';

describe('MemoryLogger', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    it("basic", function() {

        const memoryLogger = new MemoryLogger();

        memoryLogger.info("hello", "world");

        const expected = [
            {
                "timestamp": "2012-03-02T11:38:49.321Z",
                "idx": 0,
                "level": "info",
                "msg": "hello",
                "args": [
                    "world"
                ]
            }
        ];

        assertJSON(memoryLogger.toJSON(), expected);

    });

});
