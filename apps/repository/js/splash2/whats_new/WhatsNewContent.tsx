import * as React from 'react';

export class WhatsNewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <div>

                    <h3>Polar 1.31.0</h3>

                    <p>
                        Public groups!  Polar finally has support for sharing
                        documents in public groups.  We're really early in our
                        support for this just now.
                    </p>

                    <p>
                        Public groups allow you to share documents with other
                        users of Polar and to share comments and annotations.
                        With public groups you can:
                    </p>

                    <ul>
                        <li>Easily share and add documents to groups.</li>
                        <li>Add highlights and annotations and other users in that group will see the annotations.</li>
                        <li>Add comments to a document and share the comments with other members of the group.</li>
                    </ul>

                </div>

                <div>

                    <h3>Polar 1.30.6</h3>

                    <p>
                        A number of small improvements and bug fixes.  Groups
                        sharing is more reliable and easier to use.  Emails
                        with links to documents are now sent out to users
                        directly.  Users are now also required to upgrade when
                        they exceed their capacity.
                    </p>

                </div>
                <div>

                    <h3>Polar 1.30.0</h3>

                    <p>
                        <b>GREAT NEWS!</b>  Polar 1.30.0 is a big release for us
                        and includes some amazing new features!  This includes support
                        for easily sharing documents with other Polar users,
                        folders (hierarchical tags) and lots of stability
                        and bug fixes.
                    </p>

                    <h5>Group Sharing</h5>

                    <p>
                        This is by far the most important feature in this release.

                        Group sharing allows you to invite other people to
                        work with your Polar documents and collaborate with them
                        in realtime.
                    </p>

                    <p>
                        To use group sharing just open up a document and click the
                        'share' button and enter their email or select their profile
                        if you've added them in the past.
                    </p>

                    <h5>Folders</h5>

                    <p>
                        Polar now
                        has <a href="https://getpolarized.io/docs/folders.html">support for folders</a>.  The folders sidebar is on the left side by default on the
                        desktop and webapp but disabled on mobile.
                    </p>

                    <p>
                        Folders are created by using a tag with a full path like <code>/Career/CompSci</code> and
                        the folder tree in the left pane will handle showing the trees hierarchically.
                    </p>

                </div>
                <div>

                    <h3>Polar 1.19.8</h3>

                    <p>
                        We've revamped our payments system for Polar Premium and
                        the biggest change is that we're now accepting payments
                        via Stripe.
                    </p>

                    <p>
                        We've manually migrated accounts from Open Collective and
                        your payments will still process there while you have a
                        regular premium account.  If you have any issues please
                        feel free to contact <b>support@getpolarized.io</b>.
                    </p>

                    <p>
                        We're going to be working to bring on a few more premium
                        features in the next couple weeks.  These include:


                    </p>

                    <ul>
                        <li>Watch directories that can automatically import documents into Polar.</li>
                        <li>Markdown support</li>
                        <li>Dark mode</li>
                    </ul>

                    <p>
                        We're not 100% certain of the timeline on these features
                        as some of them are a bit difficult to implement.
                    </p>

                    <p>
                        We're also working on a few major changes that are taking
                        a bit longer - mostly because they're very technically
                        complicated.  These aren't available yet but are 50-80%
                        complete.
                    </p>

                    <p>
                        This includes:
                    </p>

                    <ul>
                        <li>Folder view that extends our tagging system with a full hierarchy.</li>
                        <li>Tabbed browsing for the desktop / Electron version of Polar</li>
                        <li>ePub support</li>
                    </ul>

                    <p>
                        If you'd like to see these features sooner rather than
                        later the best way you can help (besides a pull request)
                        is to upgrade to <a href="https://getpolarized.io/pricing.html">
                        Polar Premium</a>.
                    </p>

                    <b>Changes in 1.19.8 Include:</b>

                    <ul>
                        <li>New payment system for Polar premium based on Stripe.</li>
                        <li>Fixed bug when dragging area highlights.</li>
                        <li>Fixed regression in the webapp where PHZ files couldn't be loaded.</li>
                    </ul>

                    <h3>Polar 1.19.7</h3>

                    <p>
                        This release mostly focuses on stability and performance issues.
                    </p>

                    <ul>

                        <li>
                            Fixed a potential sync issue where the cache could become
                            inconsistent and polar would attempt to perform a read on a
                            document that really doesn't exist. Now we just yield a
                            warning.
                        </li>

                        <li>
                            Better handling of uppercase filenames now.
                        </li>

                        <li>
                            Fixed bug in htmlviewer where the sandbox was breaking doc loading.
                        </li>

                        <li>
                            Fixed an issue with polar on linux not resolving symlinks properly on startup.
                        </li>

                        <li>
                            JSON is now represented without spacing to cut storage costs in half and speed
                            up writes.
                        </li>

                        <li>
                            Update to latest interactjs
                        </li>

                        <li>

                            Datastore 'overview' now works on Firebase and syncs up with cloud aware
                            datastore properly I think.
                        </li>
                    </ul>

                    <h3>Polar 1.19.0</h3>

                    <div className="intro">

                        <p className="text-center">
                            <iframe className="embed-responsive-item"
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/embed/Q5SU31cT4DQ"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                        </p>

                        <p>
                            Polar 1.19 has been a lot of work but it's finally out the door.

                            There are a few we want to highlight about this release.
                        </p>

                        <b>Area Highlights</b>

                        <p>
                            Area highlights are now shown in the sidebar and
                            updated and resized while you drag the area
                            highlight box.
                        </p>

                        <b>Updated Annotations View</b>

                        <p>
                            We've updated the annotations view to show
                            preview annotations and a better view of each
                            annotation including showing area highlights.
                        </p>

                        <b>Color Selector</b>

                        <p>
                            There's now an advanced color selector for highlights
                            and this expands us to 12 different colors.  We're going
                            to expand the palette in the future but this is already
                            a step in the right directly.
                        </p>

                        <p>
                            Technically we support any RGB value but we're
                            limiting the colors you can select for now just to
                            make the UI simpler and easy to use.
                        </p>

                        <b>Performance Improvements</b>

                        <p>
                            We've also implemented some more major performance
                            improvements when working with larger documents and
                            larger sets of annotations.
                        </p>

                        <b>Native PDF Handling in Web Extension Disabled</b>

                        <p>
                            We've had to remove the native PDF handling in our web extension.
                        </p>

                        <p>
                            This feature automatically previewed and added a
                            PDF to the Polar webapp while browsing.
                        </p>

                        <p>We had to disable it due to cross domain security
                        issues we weren't able to fix. This might be enabled
                        again in a future version of Polar.</p>

                    </div>


                    <h3>Polar 1.18.0</h3>

                    <div className="intro">

                        <p>
                            This release mostly focused on improving stability
                            and implementing a few key UI features.  This
                            upgrades us to Electron 5.x which as needed for
                            some users who were experiencing severe latency
                            using Polar on Linux.  We also resolve a key issue
                            with non-atomic writes.
                        </p>

                        <p>
                            This includes a good chunk of the new sharing
                            functionality but it's not enabled yet.
                        </p>


                    </div>

                    <ul>

                        <li>Big upgrade to latest version of Electron. Electron v5.0.0, Chromium v73.0.3683.119, Node v12.0.0, v8 v7.3.492.27-electron.0. This should hopefully fix a major latency issue some users were seeing on Ubuntu/Linux.

                        </li><li>Major performance fix on large PDFs.  Scrolling should be dramatically improved.  There's still a small latency issue we're seeing but already performance is dramatically improved.

                        </li><li>Enabled atomic writes again for all platforms.

                        </li><li>Filtering for tags now lists the tags alphabetically

                        </li><li>Right click on text highlight now add 'scroll into view'

                        </li><li>Upgraded to latest version of Typescript 3.4.3

                        </li><li>Fixed regression where progress wasn't being updated when progress messages were being sent from the renderer process.

                        </li><li>Fixed bug which resorted in two file uploads to firebase while cloud sync was operational. For large files this was very painful and resorted in 2x data being uploaded.

                        </li><li>Fixed bug where the UI would break when both filtering and removing tags on a document that was visible.

                        </li>
                        <li>Increased the sidebar a bit to accommodate updating comments without overflow of the summernote bar.

                        </li>
                        <li>Using the same account widget on web + desktop now.</li>

                    </ul>

                    <h3>Polar 1.17.14</h3>

                    <div className="intro">

                        <p>
                            This release mostly focused on our Crowdfunding campaign but the full
                            changelog from 1.16.0 is below.  We're actively working on 1.18.0 which
                            will include a number of really exciting features to stay tuned!
                        </p>

                    </div>
                    <ul>

                        <li>
                            <p>Significant refactor to allow us to use direct URLs which we can calculate
                                instead of having to use Firebase metadata + URL calculation which was very
                                slow and latent.  Sometimes up to 7500ms for fetching metadata.  Now requests
                                here are consistently 200ms and sometimes 0ms if we're fairly certain the URL
                                exists (when the client is fully sync'd).</p>
                        </li>
                        <li>
                            <p>Fixed bug where iframes would not load within capture occasionally.</p>
                        </li>
                        <li>
                            <p>New support for attachments in DocInfo and the ability for attachments to
                                just be a bucket + file ref...</p>
                        </li>
                        <li>
                            <p>No longer waiting for remote writes for large files.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug with blob conversion that only hit us sometimes.</p>
                        </li>
                        <li>
                            <p>Added survey to the new NPS form too.</p>
                        </li>
                        <li>
                            <p>Integrated the net promoter score to prompt once per week so we get more NPS
                                data points.</p>
                        </li>
                        <li>
                            <p>Fixed blob streams when replicating from the cloud back to disk.</p>
                        </li>
                        <li>
                            <p>Webapp now supports range queries for fetching PDFs rather than fetching the
                                entire document.  MASSIVE performance improvement here.</p>
                        </li>
                        <li>
                            <p>Migrated to workbox as sw-precache was officially deprecated.</p>
                        </li>
                        <li>
                            <p>Fixed ugly bug with async providers reading the value before it was awaited</p>
                        </li>
                        <li>
                            <p>Fixed bugs with the disk store not properly handling deletions of .meta files</p>
                        </li>
                        <li>
                            <p>Fixed bugs with delete when the cloud store was running not properly showing
                                that deletes were performed.</p>
                        </li>
                        <li>
                            <p>Fixed bad bug where deletes were replicated and attempted to be read</p>
                        </li>
                        <li>
                            <p>New fix where a notice is given to the user that a delete was successful.</p>
                        </li>

                    </ul>
                </div>
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}
