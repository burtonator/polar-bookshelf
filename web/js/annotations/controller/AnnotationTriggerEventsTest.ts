import {assert} from 'chai';
import {TriggerEvent} from '../../contextmenu/TriggerEvent';
import {AnnotationTriggerEvents} from './AnnotationTriggerEvents';
import {assertJSON} from '../../test/Assertions';

describe('AnnotationTriggerEvents', function() {

    it("getAnnotationDescriptors", function () {

        let triggerEvent = TriggerEvent.create(TRIGGER_EVENT);
        let annotationDescriptors = AnnotationTriggerEvents.getAnnotationDescriptors(triggerEvent);

        let expected = [
            {
                "docFingerprint": "128fFMLKPk",
                "id": "110dd61fd57444010b1ab5ff38782f0f",
                "pageNum": 1,
                "type": "TEXT_HIGHLIGHT"
            }
        ];
        assertJSON(annotationDescriptors, expected)

    });

});

const TRIGGER_EVENT = {
    "type": "create-flashcard",
    "point": {
        "x": 442,
        "y": 733
    },
    "points": {
        "client": {
            "x": 442,
            "y": 733
        },
        "offset": {
            "x": 351,
            "y": 8
        },
        "page": {
            "x": 442,
            "y": 733
        },
        "pageOffset": {
            "x": 441,
            "y": 661
        }
    },
    "pageNum": 1,
    "matchingSelectors": {
        ".area-highlight": {
            "annotationDescriptors": [],
            "elements": [],
            "selector": ".area-highlight"
        },
        ".page": {
            "annotationDescriptors": [],
            "elements": [
                {}
            ],
            "selector": ".page"
        },
        ".pagemark": {
            "annotationDescriptors": [],
            "elements": [],
            "selector": ".pagemark"
        },
        ".text-highlight": {
            "annotationDescriptors": [
                {
                    "docFingerprint": "128fFMLKPk",
                    "id": "110dd61fd57444010b1ab5ff38782f0f",
                    "pageNum": 1,
                    "type": "TEXT_HIGHLIGHT"
                }
            ],
            "elements": [
                {}
            ],
            "selector": ".text-highlight"
        }
    },
    "docDescriptor": {
        "fingerprint": "110dd61fd57444010b1ab5ff38782f0f"
    }
};
