export class FirebaseTesting {

    public static validateUsers() {

        const validateEnv = (name: string) => {

            if (! process.env[name]) {
                throw new Error(`${name} is not defined`);
            }

        };

        validateEnv('FIREBASE_USER');
        validateEnv('FIREBASE_PASS');
        validateEnv('FIREBASE_USER1');
        validateEnv('FIREBASE_PASS1');
        validateEnv('FIREBASE_USER2');
        validateEnv('FIREBASE_PASS2');

    }

}
