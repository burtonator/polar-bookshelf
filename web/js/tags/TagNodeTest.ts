import {assertJSON} from '../test/Assertions';
import {TagNodes} from './TagNode';
import {Tags} from './Tags';
import {TagPaths} from './TagPaths';

describe('TagNode', function() {

    it("split", function() {

        assertJSON(TagPaths.createPathEntries("/foo"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/foo",
                "basename": "foo",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            }
        ]);

        assertJSON(TagPaths.createPathEntries("/foo/bar"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/foo",
                "basename": "foo",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            },
            {
                "path": "/foo/bar",
                "basename": "bar",
                "parent": {
                    "path": "/foo",
                    "basename": "foo"
                }
            }
        ]);

        assertJSON(TagPaths.createPathEntries("/Hello World/The Dog"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/Hello World",
                "basename": "Hello World",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            },
            {
                "path": "/Hello World/The Dog",
                "basename": "The Dog",
                "parent": {
                    "path": "/Hello World",
                    "basename": "Hello World"
                }
            }
        ]);

    });

    describe("create", function() {

        it("basic", function() {

            const tags = [
                '/',
                '/foo',
                '/foo/bar'
            ].map(current => Tags.create(current))
             .map(current => {
                    const count = 1;
                    return {...current, count};
                });

            assertJSON(TagNodes.create(...tags), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "count": 1,
                                "id": "/foo/bar",
                                "name": "bar",
                                "path": "/foo/bar",
                                "value": {
                                    "count": 1,
                                    "id": "/foo/bar",
                                    "label": "/foo/bar"
                                }
                            }
                        ],
                        "count": 1,
                        "id": "/foo",
                        "name": "foo",
                        "path": "/foo",
                        "value": {
                            "count": 1,
                            "id": "/foo",
                            "label": "/foo"
                        }
                    }
                ],
                "count": 2,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 2,
                    "id": "/",
                    "label": "/"
                }
            });

        });


        it("broken id on parent folder", function() {

            const tags = [
                '/career/compsci',
            ].map(current => Tags.create(current))
                .map(current => {
                    const count = 1;
                    return {...current, count};
                });

            assertJSON(TagNodes.create(...tags), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "count": 1,
                                "id": "/career/compsci",
                                "name": "compsci",
                                "path": "/career/compsci",
                                "value": {
                                    "count": 1,
                                    "id": "/career/compsci",
                                    "label": "/career/compsci"
                                }
                            }
                        ],
                        "count": 0,
                        "id": "/career",
                        "name": "career",
                        "path": "/career",
                        "value": {
                            "count": 0,
                            "id": "/career",
                            "label": "/career"
                        }
                    }
                ],
                "count": 1,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 1,
                    "id": "/",
                    "label": "/"
                }
            });

        });

        it("empty", function() {

            assertJSON(TagNodes.create(), {
                "children": [],
                "count": 0,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 0,
                    "id": "/",
                    "label": "/"
                }
            });

        });

    });

});
