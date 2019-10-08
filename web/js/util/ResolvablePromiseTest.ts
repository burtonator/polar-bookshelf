import {assert} from 'chai';
import {ResolvablePromise} from './ResolvablePromise';


describe('ResolvablePromise', function() {

    it("Without awaiting the promise", async function() {

        const resolvablePromise = new ResolvablePromise<string>();

        resolvablePromise.resolve('hello');

        assert.equal(await resolvablePromise, 'hello');

    });

    it("double await", async function() {

        const resolvablePromise = new ResolvablePromise<string>();

        resolvablePromise.resolve('hello');

        assert.equal(await resolvablePromise, 'hello');
        assert.equal(await resolvablePromise, 'hello');

    });
    //
    // it("reject", async function() {
    //
    //     const promise = new ResolvablePromise<string>();
    //
    //     let failures = 0;
    //
    //     let success: boolean = false;
    //
    //     promise.catch(err => ++failures);
    //     promise.then(() => success = true);
    //
    //     console.log("FIXME: ", promise.reject);
    //
    //     promise.reject(new Error('hello'));
    //
    //     try {
    //
    //         await promise;
    //
    //         console.log("This should have failed");
    //         assert.fail("Should not succeed");
    //
    //     } catch (e) {
    //         ++failures;
    //     }
    //
    // });

    it('reject2', async function() {

        // noinspection TsLint
        let resolve: (value?: string) => void = () => {};

        // noinspection TsLint
        let reject: (reason?: any) => void = () => {};

        // noinspection TsLint
        const promise = new Promise<string>((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        let failures = 0;

        promise.catch(err => ++failures);
        promise.catch(err => ++failures);

        reject(new Error("it broke"));

        try {
            await promise;
        } catch (e) {
            ++failures;
        }

        assert.equal(failures, 3);

        // FIXMEL also test that it give us the error AFTEr we reject it.

        promise.catch(err => ++failures);

        try {
            await promise;
        } catch (e) {
            ++failures;
        }

        assert.equal(failures, 5);

    });

    //
    // it("reject3", async function() {
    //
    //     const resolvablePromise = new ResolvablePromise<string>();
    //
    //     let failures = 0;
    //
    //     let success: boolean = false;
    //
    //     resolvablePromise.promise.catch(err => {
    //         ++failures;
    //         console.log("FIXME 666 here");
    //     } );
    //
    //     resolvablePromise.promise.then(() => success = true);
    //
    //     resolvablePromise.reject(new Error('hello'));
    //
    //     console.log("FIXME: 99 here");
    //
    //     // try {
    //     //
    //     //     await (resolvablePromise.promise);
    //     //
    //     //     console.log("FIXME: 1234 This should have failed");
    //     //     assert.fail("Should not succeed");
    //     //
    //     // } catch (e) {
    //     //     ++failures;
    //     // }
    //
    // });

});

