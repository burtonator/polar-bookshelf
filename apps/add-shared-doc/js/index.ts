import {Logger} from "polar-shared/src/logger/Logger";
import {AuthHandlers} from "../../../web/js/apps/repository/auth_handler/AuthHandler";
import {GroupJoins} from "../../../web/js/datastore/sharing/rpc/GroupJoins";
import {WebPersistenceLayerFactory} from "../../../web/js/datastore/factories/WebPersistenceLayerFactory";
import {GroupMemberInvitation} from "../../../web/js/datastore/sharing/db/GroupMemberInvitations";
import {PersistenceLayer} from "../../../web/js/datastore/PersistenceLayer";
import {BrowserDocLoader} from "../../../web/js/apps/main/doc_loaders/browser/BrowserDocLoader";
import {Providers} from "polar-shared/src/util/Providers";
import {LoadDocRequest} from "../../../web/js/apps/main/doc_loaders/LoadDocRequest";
import {BackendFileRefs} from "../../../web/js/datastore/BackendFileRefs";
import {RendererAnalytics} from "../../../web/js/ga/RendererAnalytics";

// *****
//
// Automatically adds a URL to your document repository by approving the sharing
// request and then redirects to a browser window showing the viewer.
//
// If the user is not logged in force their login and then redirect them back
// to approve the addition of the document then open it.
//
// *****

const log = Logger.create();

function createInvitation(): GroupMemberInvitation {
    const url = new URL(document.location.href);
    return JSON.parse(url.searchParams.get('invitation')!);
}

async function redirectToDocumentViewer(persistenceLayer: PersistenceLayer,
                                        invitation: GroupMemberInvitation) {

    // create a URL for the document and redirect us to it ...

    const docLoader = new BrowserDocLoader(Providers.toInterface(persistenceLayer));

    const docRef = invitation.docs[0];

    const {fingerprint} = docRef;

    // TODO can we get JUST the docInfo here? would be slightly faster
    const docMeta = await persistenceLayer.getDocMeta(fingerprint);

    if (! docMeta) {
        throw new Error("No DocMeta for fingerprint: " + fingerprint);
    }

    const backendFileRef = BackendFileRefs.toBackendFileRef(docMeta)!;

    const loadDocRequest: LoadDocRequest = {
        fingerprint,
        backendFileRef,
        newWindow: false
    };

    const docLoadRequest = docLoader.create(loadDocRequest);
    await docLoadRequest.load();

}

async function doHandle() {

    RendererAnalytics.event({category: 'add-shared-doc', action: 'do-handle'});

    const authHandler = AuthHandlers.get();

    const authStatus = await authHandler.status();

    if (authStatus === 'needs-authentication') {
        // the user needs to authenticate so log them in and then redirect them
        // back to this page.
        await authHandler.authenticate(document.location.href);
        return;
    }

    const persistenceLayer = WebPersistenceLayerFactory.create();
    await persistenceLayer.init(); // TODO an error listener?

    const invitation = createInvitation();

    await GroupJoins.execAndAdd(persistenceLayer, invitation);

    await redirectToDocumentViewer(persistenceLayer, invitation);

}

doHandle().catch(err => log.error("Unable to handle document share: ", err));
