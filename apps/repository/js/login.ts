import {Firebase} from '../../../web/js/firebase/Firebase';
import {Nav} from '../../../web/js/ui/util/Nav';
import {FirebaseUIAuth} from '../../../web/js/firebase/FirebaseUIAuth';
import * as firebase from '../../../web/js/firebase/lib/firebase';

window.addEventListener('load', async () => {

    Firebase.init();

    if (firebase.auth().currentUser === null) {

        const signInSuccessUrl = 'http://localhost:8500/apps/repository/index.html#configured';
        FirebaseUIAuth.login({signInSuccessUrl});

        // bring up the UI so that we can login.
        FirebaseUIAuth.login();

    }

});

Firebase.init();

