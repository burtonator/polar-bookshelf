import {GroupJoins} from "./GroupJoins";
import {GroupMemberInvitation} from "../db/GroupMemberInvitations";

describe('GroupJoins', function() {

    it("basic", function() {

        const invitation: GroupMemberInvitation = {
            "created": "2019-07-19T00:40:36.171Z",
            "docs": [
                {
                    "docID": "1Bmua6rpq1DzvhJMmvqbjZMH1Ya8g2Sj",
                    "fingerprint": "39b730b6e9d281b0eae91b2c2c29b842",
                    "nrPages": 14,
                    "tags": {},
                    "title": "availability.pdf"
                }
            ],
            "from": {
                "email": "test@getpolarized.io",
                "image": {
                    "size": null,
                    "url": "https://lh6.googleusercontent.com/-HM8tIi-Ug1Q/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdFOSaGL3nUcMqVCxU3GmT11JttSQ/mo/photo.jpg"
                },
                "name": "test test",
                "profileID": "12npAdp94QHrhoehDPg8"
            },
            "groupID": "1kMBKG7EtYpMQrFRz3bJ",
            "id": "12BsUxmL7u8mAWL9ozXq",
            "message": "",
            "to": "burton@inputneuron.io"
        };

        const url = GroupJoins.createShareURL(invitation);

        console.log(url);

    });

});
