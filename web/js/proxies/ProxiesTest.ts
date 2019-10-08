
import {assert} from 'chai';
import {Proxies} from './Proxies';
import {assertJSON} from '../test/Assertions';
import {TraceListener} from './TraceListener';
import {TraceEvent} from './TraceEvent';
import {Objects} from '../util/Objects';
import {Symbol} from '../metadata/Symbol';
import {MockDocMetas} from '../metadata/DocMetas';
import {DocMetas} from '../metadata/DocMetas';
import {TextHighlight} from '../metadata/TextHighlight';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {Numbers} from "polar-shared/src/util/Numbers";

describe('Proxies', function() {

    describe('performance', function() {

        const textHighlightData: any = {
            "id": "1xU5hiNvuy",
            "created": "2018-09-02T21:13:50.500Z",
            "lastUpdated": "2018-09-02T21:13:50.500Z",
            "rects": {
                "0": {
                    "left": 72,
                    "top": 469.3333333333333,
                    "right": 391.0260199999999,
                    "bottom": 482.66666666666663,
                    "width": 319.0260199999999,
                    "height": 13.333333333333314
                },
                "1": {
                    "left": 72,
                    "top": 482.66666666666663,
                    "right": 390.7894666666666,
                    "bottom": 496,
                    "width": 318.7894666666666,
                    "height": 13.333333333333371
                },
                "2": {
                    "left": 72,
                    "top": 496,
                    "right": 390.8363746666667,
                    "bottom": 509.3333333333333,
                    "width": 318.8363746666667,
                    "height": 13.333333333333314
                },
                "3": {
                    "left": 72,
                    "top": 509.3333333333333,
                    "right": 391.0232413333333,
                    "bottom": 522.6666666666666,
                    "width": 319.0232413333333,
                    "height": 13.333333333333314
                },
                "4": {
                    "left": 72,
                    "top": 522.6666666666666,
                    "right": 390.7615893333333,
                    "bottom": 536,
                    "width": 318.7615893333333,
                    "height": 13.333333333333371
                },
                "5": {
                    "left": 72,
                    "top": 536,
                    "right": 390.79155,
                    "bottom": 548.6666666666666,
                    "width": 318.79155,
                    "height": 12.666666666666629
                },
                "6": {
                    "left": 72,
                    "top": 548.6666666666666,
                    "right": 390.75672399999996,
                    "bottom": 562,
                    "width": 318.75672399999996,
                    "height": 13.333333333333371
                },
                "7": {
                    "left": 72,
                    "top": 562,
                    "right": 390.7578199999999,
                    "bottom": 575.3333333333333,
                    "width": 318.7578199999999,
                    "height": 13.333333333333258
                },
                "8": {
                    "left": 72,
                    "top": 575.3333333333333,
                    "right": 390.8086199999999,
                    "bottom": 588.6666666666666,
                    "width": 318.8086199999999,
                    "height": 13.333333333333371
                },
                "9": {
                    "left": 72,
                    "top": 588.6666666666666,
                    "right": 391.00954,
                    "bottom": 602,
                    "width": 319.00954,
                    "height": 13.333333333333371
                },
                "10": {
                    "left": 72,
                    "top": 602,
                    "right": 391.002632,
                    "bottom": 615.3333333333333,
                    "width": 319.002632,
                    "height": 13.333333333333258
                },
                "11": {
                    "left": 72,
                    "top": 615.3333333333333,
                    "right": 390.8061413333333,
                    "bottom": 628.6666666666666,
                    "width": 318.8061413333333,
                    "height": 13.333333333333371
                },
                "12": {
                    "left": 72,
                    "top": 628.6666666666666,
                    "right": 390.788138,
                    "bottom": 642,
                    "width": 318.788138,
                    "height": 13.333333333333371
                },
                "13": {
                    "left": 72,
                    "top": 642,
                    "right": 117.353912,
                    "bottom": 653.3333333333333,
                    "width": 45.353911999999994,
                    "height": 11.333333333333258
                }
            },
            "textSelections": {
                "0": {
                    "text": "Dynamic languages such as JavaScript are more difficult to com-",
                    "rect": {
                        "left": 72,
                        "top": 469.3333333333333,
                        "right": 391.0260199999999,
                        "bottom": 480.66666666666663,
                        "width": 319.02601999999996,
                        "height": 11.333333333333332
                    }
                },
                "1": {
                    "text": "pile than statically typed ones. Since no concrete type information",
                    "rect": {
                        "left": 72,
                        "top": 482.66666666666663,
                        "right": 390.7894666666666,
                        "bottom": 494,
                        "width": 318.7894666666666,
                        "height": 11.333333333333332
                    }
                },
                "2": {
                    "text": "is available, traditional compilers need to emit generic code that can",
                    "rect": {
                        "left": 72,
                        "top": 496,
                        "right": 390.8363746666667,
                        "bottom": 507.3333333333333,
                        "width": 318.83637466666664,
                        "height": 11.333333333333332
                    }
                },
                "3": {
                    "text": "handle all possible type combinations at runtime. We present an al-",
                    "rect": {
                        "left": 72,
                        "top": 509.3333333333333,
                        "right": 391.0232413333333,
                        "bottom": 520.6666666666666,
                        "width": 319.0232413333333,
                        "height": 11.333333333333332
                    }
                },
                "4": {
                    "text": "ternative compilation technique for dynamically-typed languages",
                    "rect": {
                        "left": 72,
                        "top": 522.6666666666666,
                        "right": 390.7615893333333,
                        "bottom": 534,
                        "width": 318.7615893333333,
                        "height": 11.333333333333332
                    }
                },
                "5": {
                    "text": "that identifies frequently executed loop traces at run-time and then",
                    "rect": {
                        "left": 72,
                        "top": 536,
                        "right": 390.79155,
                        "bottom": 547.3333333333333,
                        "width": 318.79155,
                        "height": 11.333333333333332
                    }
                },
                "6": {
                    "text": "generates machine code on the fly that is specialized for the ac-",
                    "rect": {
                        "left": 72,
                        "top": 548.6666666666666,
                        "right": 390.75672399999996,
                        "bottom": 560,
                        "width": 318.75672399999996,
                        "height": 11.333333333333332
                    }
                },
                "7": {
                    "text": "tual dynamic types occurring on each path through the loop. Our",
                    "rect": {
                        "left": 72,
                        "top": 562,
                        "right": 390.7578199999999,
                        "bottom": 573.3333333333333,
                        "width": 318.75782,
                        "height": 11.333333333333332
                    }
                },
                "8": {
                    "text": "method provides cheap inter-procedural type specialization, and an",
                    "rect": {
                        "left": 72,
                        "top": 575.3333333333333,
                        "right": 390.8086199999999,
                        "bottom": 586.6666666666666,
                        "width": 318.80861999999996,
                        "height": 11.333333333333332
                    }
                },
                "9": {
                    "text": "elegant and efficient way of incrementally compiling lazily discov-",
                    "rect": {
                        "left": 72,
                        "top": 588.6666666666666,
                        "right": 391.00954,
                        "bottom": 600,
                        "width": 319.00954,
                        "height": 11.333333333333332
                    }
                },
                "10": {
                    "text": "ered alternative paths through nested loops. We have implemented",
                    "rect": {
                        "left": 72,
                        "top": 602,
                        "right": 391.002632,
                        "bottom": 613.3333333333333,
                        "width": 319.00263199999995,
                        "height": 11.333333333333332
                    }
                },
                "11": {
                    "text": "a dynamic compiler for JavaScript based on our technique and we",
                    "rect": {
                        "left": 72,
                        "top": 615.3333333333333,
                        "right": 390.8061413333333,
                        "bottom": 626.6666666666666,
                        "width": 318.8061413333333,
                        "height": 11.333333333333332
                    }
                },
                "12": {
                    "text": "have measured speedups of 10x and more for certain benchmark",
                    "rect": {
                        "left": 72,
                        "top": 628.6666666666666,
                        "right": 390.788138,
                        "bottom": 640,
                        "width": 318.788138,
                        "height": 11.333333333333332
                    }
                },
                "13": {
                    "text": "programs",
                    "rect": {
                        "left": 72,
                        "top": 642,
                        "right": 117.353912,
                        "bottom": 653.3333333333333,
                        "width": 45.353911999999994,
                        "height": 11.333333333333332
                    }
                }
            },
            "text": "\nDynamic languages such as JavaScript are more difficult to com-\npile than statically typed ones. Since no concrete type information\nis available, traditional compilers need to emit generic code that can\nhandle all possible type combinations at runtime. We present an al-\nternative compilation technique for dynamically-typed languages\nthat identifies frequently executed loop traces at run-time and then\ngenerates machine code on the fly that is specialized for the ac-\ntual dynamic types occurring on each path through the loop. Our\nmethod provides cheap inter-procedural type specialization, and an\nelegant and efficient way of incrementally compiling lazily discov-\nered alternative paths through nested loops. We have implemented\na dynamic compiler for JavaScript based on our technique and we\nhave measured speedups of 10x and more for certain benchmark\nprograms",
            "notes": {},
            "questions": {},
            "flashcards": {},
            "images": {
                "screenshot": {
                    "type": "png",
                    "src": "screenshot:1AbQQJdatY",
                    "width": 478.2274169921875,
                    "height": 256.09375,
                    "rel": "screenshot"
                }
            }
        };

        it("basic performance", function() {

            // let docMeta = MockDocMetas.createMockDocMeta('0x001');
            let docMeta = DocMetas.create('0x001', 1);

            docMeta = Proxies.create(docMeta, (traceEvent: TraceEvent) => {
                // noop
            });

            const pageMeta = DocMetas.getPageMeta(docMeta, 1);

            const durations = [];

            for (let i = 0; i < 25; ++i) {

                const before = Date.now();

                const textHighlight = new TextHighlight(textHighlightData);
                delete pageMeta.textHighlights[textHighlight.id];

                assert.equal(0, Object.values(pageMeta.textHighlights).length);

                pageMeta.textHighlights[textHighlight.id] = textHighlight;

                assert.equal(Object.values(pageMeta.textHighlights).length, 1);

                const after = Date.now();

                const duration = after - before;
                durations.push(duration);

            }

            // the first two timings are bunk and useless due to JIT issues.
            durations.shift();
            durations.shift();

            const max = Math.max(...durations);
            const mean = Numbers.mean(...durations);

            console.log({durations});
            console.log({max, mean});

            // make sure the mean duration is not more than 2x the max to verify
            // we don't have any performance regressions.

            assert.ok(max < 50);
            assert.ok(max < mean * 15);

        });

    });

    describe('deep copy', function() {


        it("basic", function() {

            let obj: any = {
                foo: 'foo',
                cat: {
                    name: 'leo'
                }
            };

            const mutations = [];

            obj = Proxies.create(obj, (traceEvent: TraceEvent) => {
                mutations.push(traceEvent);
            });

            obj.foo = 'foo1';
            obj.cat.name = 'monster';

            assert.equal(2, mutations.length);

            obj = Dictionaries.deepCopy(obj);

            obj.foo = 'foo2';
            obj.cat.name = 'monster2';

            assert.equal(2, mutations.length);


        });

    });


    describe('paths', function() {

        it("work with paths directly", function() {

            // make sure the path is right...

            let myDict = {
                cars: {
                    "mazda6": {
                        borrowed: false
                    }
                }
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cars.mazda6.borrowed = true;

            const expected = [
                {
                    "path": "/cars/mazda6",
                    "mutationType": "SET",
                    "target": {
                        "borrowed": true
                    },
                    "property": "borrowed",
                    "value": true,
                    "previousValue": false,
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

    });

    describe('traceListeners', function() {

        // unfortunately , there are 4 types we have to test
        //
        // the default (function or object)
        // additional (function or object).

        it("default as object", function() {

            let myDict = {
                cat: "leo"
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cat = "monster";

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("default as function", function() {

            let myDict = {
                cat: "leo"
            };

            const mutations: TraceEvent[] = [];

            const traceListener =

            myDict = Proxies.create(myDict, (traceEvent) => {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });

        it("addListener as object", function() {

            let myDict: any = {
                cat: "leo"
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, () => {
                // noop
            });

            myDict.addTraceListener(myTraceListener);

            myDict.cat = "monster";

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("addListener as function", function() {

            let myDict: any = {
                cat: "leo"
            };

            myDict = Proxies.create(myDict, function() {
                // noop
            });

            const mutations: TraceEvent[] = [];

            myDict.addTraceListener((traceEvent: TraceEvent) => {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.cat = "monster";

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "monster"
                    },
                    "property": "cat",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });

    });

    describe('deepTrace', function() {

        // if we have a shared object reference, make sure we receive two events
        // for it, one at each path.
        xit("shared object reference", function() {

            const address = {
                street: "101 Fake Street",
                city: "San Francisco",
                state: "California"
            };

            let myDict = {
                alice: {
                    address
                },
                bob: {
                    address
                }
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.alice.address.city = "Oakland";

            assert.equal(myDict.alice.address.city, "Oakland");
            assert.equal(myDict.bob.address.city, "Oakland");

            // FIXME: this is broken.. we change the value in two places but
            // only fire one event listener..  I'm going to have to rethink the
            // way I'm doing events for this to work.

            const expected: TraceEvent[] = [

            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("deep tracing", function() {

            let myDict = {'foo': 'bar'};

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.foo = 'frog';

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("deep tracing with nested path", function() {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.cat.name = "monster";

            const expected = [
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("mutation of all fields", function() {

            let myDict = {
                foo: 'bar',
                cat: {
                    name: "leo"
                }
            };

            const myTraceListener = new MyTraceListener();

            myDict = Proxies.create(myDict, myTraceListener);

            myDict.foo = "cat";
            myDict.cat.name = "monster";

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "cat",
                        "cat": {
                            "name": "leo"
                        }
                    },
                    "property": "foo",
                    "value": "cat",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/cat",
                    "mutationType": "SET",
                    "target": {
                        "name": "monster"
                    },
                    "property": "name",
                    "value": "monster",
                    "previousValue": "leo",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(myTraceListener.mutations, expected);

        });

        it("as function", function() {

            let myDict = {'foo': 'bar'};

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, (traceEvent) => {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.foo = 'frog';

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "foo": "frog"
                    },
                    "property": "foo",
                    "value": "frog",
                    "previousValue": "bar",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });

        it("as nested dictionaries", function() {

            let myDict = {
                'pages': {
                    1: {
                        marked: true
                    },
                    2: {
                        marked: false
                    },
                }
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.pages[1].marked = false;

            const expected = [
                {
                    "path": "/pages/1",
                    "mutationType": "SET",
                    "target": {
                        "marked": false
                    },
                    "property": "marked",
                    "value": false,
                    "previousValue": true,
                    "mutationState": "PRESENT"
                }
            ];

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            assertJSON(mutations, expected);

        });



        it("add listener to object", function() {

            let myDict: any = {
                "cat": "dog"
            };


            myDict = Proxies.create(myDict, function(traceEvent) {
                // noop
            });

            const mutations: TraceEvent[] = [];

            myDict.addTraceListener((traceEvent: TraceEvent) => {
                mutations.push(Objects.duplicate(traceEvent));
            });

            myDict.asdf = "bar";

            // make a pattern of /pages/[int]/foo so that we can listen to the
            // stream of objects and then handle the right one.

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "cat": "dog",
                        "asdf": "bar"
                    },
                    "property": "asdf",
                    "value": "bar",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });


        it("fire initial values", function() {

            let myDict: any = {
                "cat": "dog"
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, (traceEvent) => {
                // noop
            });

            myDict.addTraceListener((traceEvent: TraceEvent) => {
                mutations.push(traceEvent);
            }).sync();

            const expected = [
                {
                    "path": "/",
                    "mutationType": "INITIAL",
                    "target": {
                        "cat": "dog"
                    },
                    "property": "cat",
                    "value": "dog",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });

        // our event listener design is broken.. the first listener is
        // recursive.. but not NEW listeners...
        xit("modify nested value with listener at root", function() {

            let myDict: any = {
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                // noop
            });

            myDict.addTraceListener((traceEvent: TraceEvent) => {
                mutations.push(traceEvent);
            });

            myDict.car = {};

            myDict.car.type = "mazda";

            const expected: TraceEvent[] = [
            ];

            assertJSON(mutations, expected);

        });

        it("delete value", function() {

            let myDict = {
                "cat": "dog"
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(traceEvent);
            });

            delete myDict.cat;

            const expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {},
                    "property": "cat",
                    "previousValue": "dog",
                    "mutationState": "ABSENT"
                }
            ];

            assert.equal( mutations[0].previousValue, "dog");
            assert.equal( mutations[0].value === undefined, true);
            assert.equal( "value" in mutations[0], true);

            assertJSON(mutations, expected);

        });

        it("make sure value actually replaced", function() {

            let myDict = {
                "cat": "leo"
            };

            myDict = Proxies.create(myDict, function(traceEvent) {
                return true;
            });

            myDict.cat = "monster";

            assert.equal( myDict.cat, "monster");

        });


        it("add object to existing traced object and expect mutation events", function() {

            let myDict: any = {
                "rootPrimitiveValue": "dog"
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, function(traceEvent) {
                mutations.push(Objects.duplicate(traceEvent));
            });

            assert.equal( myDict.__path, "/" );

            // this should trigger a new handler to be added
            myDict.depth0 = {

            };

            myDict.depth0.depth1 = {

            };

            myDict.depth0.depth2 = {
                deepPrimitiveValue: "cat"
            };

            // now add more data to the gorilla.

            myDict.depth0.depth2.setPrimitiveValue = "red";

            assert.equal( myDict.__traceListeners.length, 1 );
            assert.equal( myDict.depth0.__traceListeners.length, 1 );
            assert.equal( myDict.depth0.depth1.__traceListeners.length, 1 );

            assert.equal( myDict.depth0.__path, "/depth0" );
            assert.equal( myDict.depth0.depth1.__path, "/depth0/depth1" );

            assert.equal(mutations.length, 4);

            const expected = [
                {
                    "path": "/",
                    "mutationType": "SET",
                    "target": {
                        "rootPrimitiveValue": "dog",
                        "depth0": {}
                    },
                    "property": "depth0",
                    "value": {},
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0",
                    "mutationType": "SET",
                    "target": {
                        "depth1": {}
                    },
                    "property": "depth1",
                    "value": {},
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0",
                    "mutationType": "SET",
                    "target": {
                        "depth1": {},
                        "depth2": {
                            "deepPrimitiveValue": "cat"
                        }
                    },
                    "property": "depth2",
                    "value": {
                        "deepPrimitiveValue": "cat"
                    },
                    "mutationState": "PRESENT"
                },
                {
                    "path": "/depth0/depth2",
                    "mutationType": "SET",
                    "target": {
                        "deepPrimitiveValue": "cat",
                        "setPrimitiveValue": "red"
                    },
                    "property": "setPrimitiveValue",
                    "value": "red",
                    "mutationState": "PRESENT"
                }
            ];

            assertJSON(mutations, expected);

        });

    });

    describe('deepTrace', function() {

        it("test with object.Freeze", function() {

            const TYPE = Object.freeze({
                MAMMAL: new Symbol("MAMMAL"),
                MARSUPIAL: new Symbol("MARSUPIAL")
            });

            let myDict: any = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            const mutations: TraceEvent[] = [];

            myDict = Proxies.create(myDict, (traceEvent) => {
                mutations.push(traceEvent);
            });

            delete myDict.foo;

            const expected = [
                {
                    "path": "/",
                    "mutationType": "DELETE",
                    "target": {
                        "cat": {
                            "type": "MAMMAL"
                        },
                        "dog": {
                            "type": "MAMMAL"
                        }
                    },
                    "property": "foo",
                    "mutationState": "ABSENT"
                }
            ];

            assertJSON(mutations, expected, undefined, true);

        });

        it("test symbols used twice...", function() {

            const TYPE = Object.freeze({
                MAMMAL: new Symbol("MAMMAL"),
                MARSUPIAL: new Symbol("MARSUPIAL")
            });

            let myDict: any = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };


            Proxies.create(myDict);

            myDict = {
                cat: {
                    type: TYPE.MAMMAL
                },
                dog: {
                    type: TYPE.MAMMAL
                },
            };

            Proxies.create(myDict);

        });

    });

});

class MyTraceListener implements TraceListener {

    public mutations: TraceEvent[] = [];

    public onMutation(traceEvent: TraceEvent) {
        // in practice we would write this to a journaled log file.
        this.mutations.push(Objects.duplicate(traceEvent));
        return true;
    }

}
