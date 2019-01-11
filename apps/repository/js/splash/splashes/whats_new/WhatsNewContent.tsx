import * as React from 'react';
import {Logger} from '../../../../../../web/js/logger/Logger';
import {EmbeddedImages} from './EmbeddedImages';

const log = Logger.create();

export class WhatsNewContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>

                <h3>Polar 1.8</h3>

                <div className="intro">

                    <p>
                        This release concentrated on a number of smaller features
                        requested by users plus fit and finish.  The major changes
                        include refactoring the text editor so that it's more
                        clear that it supports rich text and formatted HTML.
                        We also now support cloze deletions for Anki which was
                        a big feature for a lot of users but required a big
                        refactor.  Additionally we have a new logs view so that
                        you can monitor the internal behavior of Polar during
                        sync (and other) operations.  You can also copy the entire
                        log to the clipboard for reporting bugs to the Polar
                        developers.

                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>PDFs auto-import when trying to share them from the browser.</li>

                        <li>Refactored the rich text editor so the bar at the top is no longer in 'air'
                        mode so that users can realize that it supports rich text.</li>

                        <li>Support for cloze deletion</li>

                        <li>Stats view for core stats</li>

                        <li>New logs view to show logs as they're being written which can help users
                        debug issues with Polar and report problems to the dev team plus understand
                        what's happening with their data.</li>

                        <li>Related tags in the tag selector</li>

                        <li>'capturing' a PDF from the browser now works and the PDF is then saved into
                        the repository.</li>

                        <li>Copy URL to clipboard shows toaster that the URL was copied successfully.</li>

                        <li>Reveal file in finder (or Explorer on Windows).</li>

                        <li>Copy file path to clipboard.</li>

                    </ul>

                </div>

                <h3>Polar 1.7 - Annotation Manager</h3>

                <div className="intro">

                    <p>
                        This release focuses on two major new features - a
                        sidebar and also a an annotation view to allow users
                        to view the annotations they've made on documents.
                    </p>

                    <p className="text-center">
                        <iframe width="560" height="315"
                                src="https://www.youtube.com/embed/oGk9Skaa6Q0"
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>
                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li> New annotations view to see all your annotations in one place.</li>

                        <li> New sidebar to expand contract to show other pages within polar</li>

                        <li>  New option to create a pagemark at the mouse point.  Still more work to make
                            the key bindings visible.</li>

                        <li>  Adding forced CSS for ::selection so that sites that have broken CSS for
                        highlighting don't actually break polar and we also have consistent highlight
                            support.</li>

                        <li>  Fixed some navigational issues in the web capture system.</li>

                        <li>  Fixed bug the annotation bar in PDF where resize will kill it.  Hopefully the
                            last bug there.</li>

                        <li>  Backend changes to support cloze deletions in Anki.</li>

                    </ul>

                </div>

                <h3>Polar 1.6 - Polar Needs Your Help!</h3>

                <div className="intro">

                    <p>
                        This release focuses on stability but adds a few new
                        features.
                    </p>

                    <p>
                        The biggest changes in this release include
                        a <b>major</b> performance improvement on Windows as well
                        as a <i>new annotation bar</i> that should be both
                        faster and much more reliable (especially with PDFs).
                    </p>

                    <h4>
                        Polar Needs Your Help!
                    </h4>

                    <p>
                        I'd like you to <i>please do me a favor</i> and just take
                        two minutes and see if you can help out Polar.
                    </p>

                    <p>
                        <i className="fas fa-envelope-open text-success"></i>&nbsp;

                        <b>Email 5 colleagues about Polar! </b> Can you take 1 minute
                        and send an email to 5 of your colleagues about Polar and
                        explain (in your own words) why you like it?

                    </p>

                    <p>

                        <i className="fas fa-link text-success"></i>&nbsp;

                        <b>Blog and Link to Polar! </b> If you have a blog
                        or a website could you take 5 minutes and write up a
                        blog post about Polar?  Post to your favorite forum?

                        We have to get the word out and your help is really
                        vital here.

                        Even just a link at the bottom of your website would be
                        a massive help!

                    </p>

                    <p>
                        <i className="fas fa-donate text-success"></i>&nbsp;

                        <b>Can you make a donation to Polar? </b>
                        We have an <a
                        href="https://opencollective.com/polar-bookshelf/donate">Open
                        Collective</a> setup to accept donations.  If you use
                        Polar at work ask your employer if they can make a donation.
                        Many larger employers will both match donations and support
                        projects that help their employees.
                    </p>

                    <p className="text-center">
                        <a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">
                            <img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />
                        </a>
                    </p>

                    <p>
                        <i className="fas fa-cloud text-success"></i>&nbsp;

                        <b>Please use cloud sync!</b> If you haven't setup cloud
                        sync yet we'd appreciate your feedback.  Cloud sync is
                        going to be used for Polar document collaboration and we
                        need more people to test it and provide feedback.

                    </p>

                    <h4>Changelog:</h4>

                    <ul>

                        <li>Fixed possible regression due to using SVG icons as these broke the app repo and possibly a few other issue.</li>

                        <li>Re-add uncaught exception handlers on app exit.  Hope to fix the issues we were having with exceptions on app exit.</li>

                        <li>Completely new annotation bar for highlighting which should fix a major bug with the PDF mode.</li>

                        <li>Fixed some fonts + css with the sidebar.</li>

                        <li>Improved indeterminate progress bar on MacOS and just better in general</li>

                        <li>Print the version numbers for updates.</li>

                        <li>Fixed quote mangling due to improper UTF-8 handling.</li>

                        <li>Hopefully fixed high CPU bug on Windows caused by shutdown and attempting to double-close windows.</li>

                        <li>Implemented Control+Enter for creating comments.</li>

                        <li>Making tags + updated + added columns visible by default for new users. I think some people did not discover it by default.</li>

                    </ul>


                </div>


                <h3>Polar 1.5 - Cloud Sync</h3>

                {/*<p className="text-muted">Dec 12, 2018</p>*/}

                <div className="intro">

                    <p className="text-center">
                        <i className="fas fa-cloud-upload-alt"
                           style={{ fontSize: '120px', margin: '20px', color: '#007bff'}}></i>

                        <h1 className="title">Polar Cloud Sync</h1>

                        <p className="subtitle">
                            Polar now supports cloud sync powered by Firebase.
                        </p>

                    </p>

                    <p>
                        Cloud sync is real-time - as soon as you make a change to a
                        local document it is immediately synchronized to the
                        cloud and then to the other computers you have which run
                        Polar.
                    </p>

                    <p>Cloud sync is free for smaller instances and <b>$7.99</b> for
                        users with more than 100 documents.
                    </p>

                    <p>
                        To ensure data safety we now support local lightweight
                        backups of your data. We take backups at critical points
                        including just before you synchronize for the first
                        time.
                    </p>

                </div>

                <h2>1.1.0 - Nov 29, 2018</h2>

                <div className="intro">

                    <p className="text-center">

                        <img style={{maxHeight: '200px'}} className="img-fluid" src={EmbeddedImages.POLAR_LOGO}></img>

                        <span style={{fontSize: '85px', margin: '15px'}}>+</span>

                        <img style={{maxHeight: '200px'}} className="img-fluid" src={EmbeddedImages.CHROME_LOGO}></img>

                        <h1 className="title">Polar 1.1 - Chrome Extension Support!</h1>

                    </p>

                    <p>
                        Polar 1.1 is fresh out the door and a lot of amazing features and
                        bug fixes are enabled in this release.
                    </p>

                    <p>
                        The biggest feature by far is our support for
                        the <a href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd">'Save to Polar' chrome extension</a> that
                        allows you to send the URL of your active tab to Polar
                        for content capture.
                    </p>

                    <p>
                        This makes it a lot easier to work with Polar as you can
                        just click a button in Chrome and have it sent to Polar.
                    </p>

                    <p>
                        We plan on adding support for Safari, and Firefox in the
                        future but we're taking things one step at a time.
                    </p>

                    <p className="text-center">
                        <a className="btn btn-success btn-lg"
                           href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd"
                           role="button">Get the 'Save to Polar' Chrome Extension</a>
                    </p>

                    <h3>Other features in 1.1 include:</h3>

                    <li>
                        Disabling amp for now until we have a better solution on how to show the user
                        that an AMP page is displayed and how to disable / enable it.  Otherwise its
                        confusing and often the amp page is WORSE not better.
                    </li>

                    <li>
                        Fixed bugs with the browser size not changing during capture browser changing
                        and also fixed some issues with it not properly accepting the browser change
                        in some situations.
                    </li>

                    <li>
                        Fixed bug in HTML zoom where the page would be truncated improperly.
                    </li>

                    <li>
                        Blocked amp ads during the capture but they aren't blocked during the preview
                        at the moment.
                    </li>

                    <li>
                        "Fixed" nasty anti-aliasing bug in electron by blocking amp ads. They were
                        annoying anyway but for some reason they were breaking chrome rendering -
                        probably due to some web component nonsense.
                    </li>

                    <li>
                        Implemented a new strategy with the vertical height algorithm in the capture
                        system to revert it back to auto instead of a fixed max-height.  Works a lot
                        better now.
                    </li>

                    <li>
                        Date/times no longer include ' ago' to be a bit more concise.
                    </li>

                    <li>
                        Added small FAQ entry to enable Anki sync.
                    </li>

                    <li>
                        Fixed a bug where we could select text and not properly work with elements.
                    </li>

                    <li>
                        Renderer analytics didn't understand that a callback without an error wasn't
                        a failure.
                    </li>

                    <li>
                        Upgraded a number of important react packages:
                        react react-dom react-moment react-select @types/react-table
                        @types/react-select @types/react @types/prop-types @types/node-fetch
                    </li>

                    <li>
                        removed inversify package (were not using it)
                    </li>

                    <li>
                        latest fontawesome
                    </li>

                    <li>
                        latest node-fetch
                    </li>

                    <li>
                        fixed issue with electron-builder where it was forcing us to upgrade to the
                        latest version for each release.
                    </li>

                </div>


                {/*<h2>1.0.14 - Nov 17, 2018</h2>*/}

                {/*<p className="text-center">*/}

                    {/*<a href="https://kevinburton1.typeform.com/to/SsuiyB">*/}
                        {/*<img src={EmbeddedImages.SURVEY}></img>*/}
                    {/*</a>*/}

                {/*</p>*/}

                {/*<p>*/}
                    {/*Could you take 2 minutes and <a href="https://kevinburton1.typeform.com/to/SsuiyB">answer 10 questions*/}
                    {/*</a> about*/}
                    {/*your use of Polar?  We're trying to focus on the most*/}
                    {/*important features for our user base and your feedback*/}
                    {/*is critical!*/}
                {/*</p>*/}

                {/*<h3>Project Update</h3>*/}

                {/*<p>*/}
                    {/*The 10.0.14 release focuses mostly on fit and finish.  This*/}
                    {/*is mostly a bug fix release but some of these were important.*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*The big news is all under the covers and we're about a week*/}
                    {/*away from having functional cloud sync.  The cloud sync*/}
                    {/*support will also be the basis for our online document*/}
                    {/*collaboration as well as mobile sync so it's going to be*/}
                    {/*really exciting to turn on this new functionality.*/}
                {/*</p>*/}

                {/*<h3>What's new in 10.0.14:</h3>*/}

                {/*<li>*/}
                    {/*Fixed bug where the lightbox was kept enabled after we*/}
                    {/*deleted an annotation*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*We can now capture a new class of documents that use a*/}
                    {/*vertical height on their CSS selectors.*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*We can now capture XML documents which used XSL stylesheets.*/}
                {/*</li>*/}

                {/*<li>*/}
                    {/*Major refactor of the disk datastore for the pending cloud*/}
                    {/*sync functionality we're working on.*/}
                {/*</li>*/}

                {/*<ul>*/}

                {/*</ul>*/}

                {/*<h2>1.0.12 - Nov 9, 2018</h2>*/}

                {/*<ul>*/}

                    {/*<li>*/}
                        {/*Feature: drag and drop for bulk PDF import works.*/}
                    {/*</li>*/}

                    {/*<li> Feature: The "Delete" text is now danger red.*/}
                    {/*</li>*/}

                    {/*<li> Feature: Implemented a confirm prompt when*/}
                    {/*deleteing flashcards, comments, and annotations.*/}
                    {/*</li>*/}

                    {/*<li> Feature: Implemented Cancel when creating*/}
                    {/*flashcards and comments </li>*/}

                    {/*<li> Feature: Reworked anki sync to run from the doc*/}
                    {/*repository. </li>*/}

                    {/*<li> Feature: Renamed "Copy URL" to "Copy Original*/}
                    {/*URL" </li>*/}

                    {/*<li> Fixed analytics around number of documents in*/}
                        {/*the repository </li>*/}

                    {/*<li> Upgrade to Electron 3.0.8 </li>*/}

                    {/*<li> Fixed bug with Electron generating an error*/}
                    {/*window on exit due to a conversion of the wrong type*/}
                    {/*to an integer.  This was/is an Electron bug. </li>*/}

                {/*</ul>*/}

                {/*<h2>1.0.10 - Nov 1, 2018</h2>*/}

                {/*<p>*/}
                    {/*A bunch of changes went into this release.  Most importantly*/}
                    {/*we've setup an <a href="https://opencollective.com/polar-bookshelf">*/}
                    {/*Open Collective project</a> to accept donations for helping support Polar*/}
                    {/*development.*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*I would personally appreciate it if you sponsored*/}
                    {/*Polar as it took me about two months of development*/}
                    {/*time and nearly $1k of my own funds to launch the*/}
                    {/*project.  We still have additional costs including*/}
                    {/*continuous integration builds, hosting costs, etc.*/}
                {/*</p>*/}

                {/*<p className="text-center">*/}
                    {/*<a href="https://opencollective.com/polar-bookshelf/donate" target="_blank">*/}
                        {/*<img src="https://opencollective.com/polar-bookshelf/donate/button@2x.png?color=blue" width="300" />*/}
                    {/*</a>*/}
                {/*</p>*/}

                {/*<h3>Bulk Import</h3>*/}

                {/*<p>*/}
                    {/*This is probably the biggest new feature in this*/}
                    {/*release.  This allows you to import a large collection*/}
                    {/*of PDFs in a directory by selecting multiple PDFs you*/}
                    {/*would like to important*/}
                    {/*via <code>File | Import</code> and they will be*/}
                    {/*imported into Polar along with any*/}
                    {/*potential metadata (title and number of pages).*/}
                {/*</p>*/}

                {/*<p>*/}
                    {/*Other important features in this release include:*/}
                {/*</p>*/}

                {/*<ul>*/}

                    {/*<li>*/}
                        {/*Change capture key binding*/}
                        {/*to <code>CommandOrControl+N</code> (new).*/}
                        {/*The other key binding conflicted with window*/}
                        {/*management in Chrome and we might want to use those*/}
                        {/*key bindings in the future.*/}
                    {/*</li>*/}

                    {/*<li> Refactored the way we're handling popups for*/}
                        {/*the annotation bar.  I think this will resolve most*/}
                        {/*of the issues we're having but there are still a few*/}
                        {/*more glitches to be fixed. </li>*/}

                    {/*<li> Reworked the capture preview browser so that*/}
                        {/*buttons are only enabled after you first load a URL*/}
                        {/*so that it's not confusing for the user. </li>*/}

                {/*</ul>*/}
            </div>
        );
    }

}

interface IProps {
}

interface IState {
}
