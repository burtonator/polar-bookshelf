
export const FIREBASE_USER="getpolarized.test+test@gmail.com";
export const FIREBASE_PASS="mk9z79vlquixvqd";

export const FIREBASE_USER1="getpolarized.test+test1@gmail.com";
export const FIREBASE_PASS1="mk9z79vlquixvqd";

export const FIREBASE_USER2="getpolarized.test+test2@gmail.com";
export const FIREBASE_PASS2="mk9z79vlquixvqd";

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
