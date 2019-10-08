import {assert} from 'chai';
import {Promises} from './Promises';
import {Latch} from "polar-shared/src/util/Latch";

describe('Promises', function() {

    it("Basic", async function() {

    });

    describe("any", async function() {

        it("with one successful", async function() {

            const p = new Latch<boolean>();

            const result = Promises.any(p.get());

            p.resolve(true);

            assert.equal(await result, true);

        });

        it("with one rejected", async function() {

            const p = new Latch<boolean>();

            const result = Promises.any(p.get());

            p.reject(new Error("this is a fake error"));

            await assertThrowsAsync(async () => await result);

        });

        it("with two successful", async function() {

            const p0 = new Latch<string>();
            const p1 = new Latch<string>();

            const result = Promises.any(p0.get(), p1.get());

            p0.resolve("p0");
            p1.resolve("p1");

            assert.equal(await result, "p0");

        });

        it("with first successful", async function() {

            const p0 = new Latch<string>();
            const p1 = new Latch<string>();

            const result = Promises.any(p0.get(), p1.get());

            p0.resolve("p0");
            p1.reject(new Error("fake"));

            assert.equal(await result, "p0");

        });

        it("with second successful", async function() {

            const p0 = new Latch<string>();
            const p1 = new Latch<string>();

            const result = Promises.any(p0.get(), p1.get());

            p0.reject(new Error("fake"));
            p1.resolve("p1");

            assert.equal(await result, "p1");

        });

        it("with both failing", async function() {

            const p0 = new Latch<string>();
            const p1 = new Latch<string>();

            const result = Promises.any(p0.get(), p1.get());

            p0.reject(new Error("fake"));
            p1.reject(new Error("fake"));

            await assertThrowsAsync(async () => await result);

        });


    });

});

async function assertThrowsAsync(func: () => Promise<any>) {

    try {

        await func();
        assert.isTrue(false, "Did not throw an exception.");

    } catch (e) {
        // noop
    }

}
