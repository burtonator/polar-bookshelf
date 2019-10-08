import {assert} from 'chai';
import {PageMeta} from './PageMeta';
import {TextHighlights} from './TextHighlights';
import {assertJSON} from '../test/Assertions';

describe('TestHighlights', function() {

    it("deleteTextHighlight", async function() {

        const pageMeta = new PageMeta(PAGE_META);

        const textHighlight = pageMeta.textHighlights['1xU5hiNvuy'];

        TextHighlights.deleteTextHighlight(pageMeta, textHighlight);

        assert.equal(Object.values(pageMeta.textHighlights).length, 0);

        const expected: any = {
            "pagemarks": {},
            "notes": {},
            "comments": {},
            "questions": {},
            "readingProgress": {},
            "flashcards": {},
            "textHighlights": {},
            "areaHighlights": {},
            "screenshots": {},
            "thumbnails": {},
            "pageInfo": {
                "num": 1
            }
        };

        assertJSON(pageMeta, expected);

    });

});

const PAGE_META: any = {
    "pagemarks": {},
    "notes": {},
    "questions": {},
    "flashcards": {},
    "textHighlights": {
        "1xU5hiNvuy": {
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
        }
    },
    "areaHighlights": {},
    "screenshots": {},
    "thumbnails": {},
    "pageInfo": {
        "num": 1
    }
};
