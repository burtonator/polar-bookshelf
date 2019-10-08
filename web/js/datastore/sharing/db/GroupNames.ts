import {Tags} from "polar-shared/src/tags/Tags";

export class GroupNames {

    public static assertValid(name: string) {

        function assertDoesNotContain(ch: string) {

            if (name.indexOf(ch) !== -1 ) {
                throw new Error("name must not contain: " + ch);
            }

        }

        assertDoesNotContain(':');
        assertDoesNotContain('#');
        assertDoesNotContain('/');

        Tags.assertValid(name);

    }

}
