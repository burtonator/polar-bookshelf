
# latest

- improved issue with markdown exports and text

- Big upgrade of dependencies.  firebase and pdf.js

- Actually fixed the sidebar stall loading bug.  Wasn't actually fixed. 

# 1.32.13

- Polar site now has SEO metadata for linked pages.  

- cleanup of dependencies to avoid security issues.

- Migrating to lerna for module management.  Things aren't perfect yet and version 
  numbers might have gaps from here on out. 

- Fixed a bad bug which caused the sidebar to continually reload over and over again. 
  We can still make it faster by using pure components I think.

# 1.32.1

- Better name for the root node (Documents and Annotations)

- URL nav should work in android now...

# 1.32.0

- Fixed a bug that prevented mobile working properly.

- Fixed wrap in dropdown buttons.

- Fixed a bug with the MessageBox modal where the background wasn't inherited 
  and the zIndex was wrong.

- Rewrite of URL handling so that /groups are real URLs not hash URLs.

- Fixed bug with overflow handling and the app not properly using scrollbars.

# 1.31.1

- /groups doesn't require auth now... auth is only triggered when you try to add
  a document or create a group.

# 1.31.0

- Suggest that Anki users install the appropriate model names instead of a  
  generic error.

- Initial version of polar public groups.  This is just a minimally viable
  release to test out new features and get user feedback.  There's still a lot
  left to do.

# 1.30.8 

- Small bug when dealing with account upgrades not allowing current plans to work.

# 1.30.7 

- Support for yearly payment plans

# 1.30.6 

- Users are required to upgrade now.  We won't allow more documents to be added
  to the repository otherwise.

# 1.30.5

- Telling the user that their account will now be disabled

- Analytics for adding documents...

# 1.30.4

- fixed bug with returning undefined values of profiles that lack metadata

# 1.30.2

- ability to handle add document requests from a URL

# 1.30.1

- Encourage users of free to go with Polar Premium...

- Fixed bug with archive and flag not working.

- Upgrade to Electron 5.0.6...

- Fixed security dependency issue with lodash.

# 1.30.0

- Group sharing support added to Polar. You can now directly share documents 
  with other users.

# 1.20.0

- Forcing upgrades for users using large amounts of cloud storage.  

- Implementation of folders now.

# 1.19.9

- Fixed small bug where a pagemark with zero percent says that it 
  'has no percentage' but this is because zero is false and very misleading. 
  I have to be more careful of that bug.

# 1.19.8

- New payment system for Polar premium

- Fixed bug when dragging area highlights.

- Fixed regression in the webapp where PHZ files couldn't be loaded.

# 1.19.7

- Fixed a potential sync issue where the cache could become inconsistent and 
  polar would attempt to perform a read on a document that really doesn't exist.
  
  Now we just yield a warning.

- Better handling of uppercase filenames now.

- Fixed bug in htmlviewer where the sandbox was breaking doc loading.

- Fixed an issue with polar on linux not resolving symlinks properly on startup.

- JSON is now represented without spacing to cut storage costs in half and speed
  up writes.  

- Update to latest interactjs

- Datastore 'overview' now works on Firebase and syncs up with cloud aware 
  datastore properly I think.

# 1.19.6

- Fixed typo with "Appendix"

- More aggressive prompting for suggestions but only 1x per week now.

- new clipboard cleanser for properly handling the clipboard when pasting from 
  part of the PDF.  The handling is not yet perfect but we're making steps in 
  that direction at least.

- Fixed bug with highlights vanishing when colors were changed

- Fixed bugs with .debs 

# 1.19.5

- Fixes some bugs with snaps

# 1.19.4

- we are now prompting the user for suggestions on how to fix polar.

- unique machines code properly merged 

- enable snap distribution again. 

# 1.19.3

- Using a border around the selected item in the annotation view not a background

- Fixed bug with the percentages being slightly off and causing issues being 
  greater than 100%

- Fixed a small performance issue with N writes during write() which also means
  we increase performance but lower Firebase costs.

- Fixed bug with formatting being selected and part of the form being selected 
  when double clicking in comments.
  
# 1.19.2

- Fixed bug with deletes not working. I need to get automated testing setup!

# 1.19.1

- fixed a CSS issue with the dock

- Fixed a bad bug where comments and flashcards wouldn't reload in the sidebar.

- set a max height for the background resizer and don't allow it to go crazy
  resizing itself forever.

- annotation sidebar is resizeable now

- proper capture of iframes now

- upgrade to latest jsdom

- 'Delete' char now works to delete one or multiple docs and you're prompted to
  confirm.

- Fixed bug where the PDF page size yielded an incorrect placement of the area 
  highlight.

- The left side dock in the annotation view is now resizeable.

# 1.19.0

- Fixed major performance issue when creating lots of annotations.

- New color picker with advanced colors for highlights.

- Fixed bug where capture would not remove noscript elements and would mangle 
  the UI.
  
- Dropdowns are faster now due to no delay.

- Fixed bug with pagemarks < 1%   

- Upgrade to Electron 5.0.1

- Fixed bug with mouse up when using iframes.

- Area highlights now supported

- Updated annotation view which is more usable and allows you to work with your 
  notes and annotations more directly including better filtering and UI.

- Polar chrome extension no longer handles PDFs by default.  We will have to 
  keep this functionality disabled until we can embed the entire web app 
  within the chrome extension but this is a difficult task for now.

# 1.18.1

- new component to ScrollIntoView so that when we're dealing with scrollable 
  and long form content we can make sure the content and scrolled and viewable. 

- New handling for scrolling so that documents with slight overflow don't shift
  on us.

- Fixed bug where capture would fail because load was 'aborted' but it really
  doesn't matter as we're just triggering load and it's up to the user if they
  want to capture.

- Polar chrome extension now part of main polar repo for better support and 
  faster iteration.

- Upgraded to latest firebase versions

- cleanup orphan javascript

# 1.18.0

- Big upgrade to latest version of Electron:

    Electron v5.0.0, Chromium v73.0.3683.119, Node v12.0.0, v8 v7.3.492.27-electron.0

  This should hopefully fix a major latency issue some users were seeing on 
  Ubuntu/Linux.

- Major performance fix on large PDFs.  Scrolling should be dramatically 
  improved.  There's still a small latency issue we're seeing but already 
  performance is dramatically improved.

- Enabled atomic writes again for all platforms.

- Filtering for tags now lists the tags alphabetically

- Right click on text highlight now add 'scroll into view'

- Upgraded to latest version of Typescript 3.4.3

- Fixed regression where progress wasn't being updated when progress messages
  were being sent from the renderer process.

- Fixed bug which resorted in two file uploads to firebase while cloud sync 
  was operational. For large files this was very painful and resorted in 2x 
  data being uploaded.

- Fixed bug where the UI would break when both filtering and removing tags on 
  a document that was visible.

- Increased the sidebar a bit to accommodate updating comments without overflow
  of the summernote bar.

- Using the same account widget on web + desktop now.

# 1.17.5

- Recording NPS and other stats in Firebase for analysis in bulk.

- Completely reworked the splash system 
  
- Release to focus on our crowdfunding campaign.

# 1.17.4

- Significant refactor to allow us to use direct URLs which we can calculate 
  instead of having to use Firebase metadata + URL calculation which was very 
  slow and latent.  Sometimes up to 7500ms for fetching metadata.  Now requests 
  here are consistently 200ms and sometimes 0ms if we're fairly certain the URL
  exists (when the client is fully sync'd).

- Fixed bug where iframes would not load within capture occasionally. 

- New support for attachments in DocInfo and the ability for attachments to 
  just be a bucket + file ref...  

- No longer waiting for remote writes for large files.

# 1.17.3

- Fixed bad bug with blob conversion that only hit us sometimes.

- Added survey to the new NPS form too.

- Integrated the net promoter score to prompt once per week so we get more NPS 
  data points.

# 1.17.2

- Fixed blob streams when replicating from the cloud back to disk.  

- Webapp now supports range queries for fetching PDFs rather than fetching the 
  entire document.  MASSIVE performance improvement here.

- Migrated to workbox as sw-precache was officially deprecated.

# 1.17.1

- Fixed ugly bug with async providers reading the value before it was awaited                                                            

- Fixed bugs with the disk store not properly handling deletions of .meta files
 
- Fixed bugs with delete when the cloud store was running not properly showing
  that deletes were performed.
  
- Fixed bad bug where deletes were replicated and attempted to be read

- New fix where a notice is given to the user that a delete was successful.

# 1.17.0

- Added the ability to easily open a document by right clicking.

- Title search now works if the substring is in the filename

- New initial document sharing in Polar.  Shares both the document and the 
  annotations associated with it. Private by default of course..

- New logging feature to change the log level via session or local storage.  We
  can use this in the future to let users change their polar log level on the 
  fly from within Polar.

- Fixed ugly bug with handling special chars in filenames within the browser.
                                                           t t 
- In Electron, the viewer window and the app repo now share the same session and
  the this means that we can use the cloud or firebase datastore... whichever 
  we are configured for...  

# 1.16.4

- Fixed bug with hidden dropdown items not being hidden.

- Firebase usage on the web about 4-10x faster due to properly using snapshots 
  instead of fetching each record individually. 

- disable payments on appx...

# 1.16.3

- Firebase usage on the web about 4-10x faster due to properly using snapshots 
  instead of fetching each record individually. 

- disable payments on appx...

# 1.16.2

- Fixed ugly bug which caused an error to be raised during capture which was a 
  false positive.

- Merged patch from Adam Wolf for hierarchical tags in Anki.

# 1.16.1

- Better link to chrome inline installation for now...

# 1.16.0

- Multi-delete button now uses the confirm prompt properly.

- The doc repo now supports a context menu for each row

- Fixed major performance issue with the datastore on Electron as it was going 
  through the IPC process for the datastore data reads and this was amazingly 
  slow. Moving it into the renderer process speeds up reads by about 10x.

- Fixed bad bug in the webapp where we wouldn't ever fetch the latest docs from
  firebase.

- A ton of improvement to tooltips needed for mobile support but also the fact 
  that having them popup bothered a lot of users.

- Inline app message that styling with rich HTML is supported for new users.

- More improvements for mobile.

- Fixed bag bug where Firebase batches weren't used properly and we had a 
  delete outside of the batch which could leave FB inconsistent. 

- Always show the multi-delete and multi-tag buttons even if just one is 
  selected as it will still work just fine.

- Make the top buttons for tagging and delete permanently displayed not hidden. 

- Added a couple key metrics for Firebase performance via tracer so that we can
  verify real-world behavior.

- RendererAnalytics now safer if accidentally called from the Node context and 
  just silently fails.

- RendererAnalytics now supports using a stopwatch so we can track the times 
  of important operations.

- Improved CSS of annotation sidebar and included instructions on how to create
  your first annotation.

- Use the sidebar area to explain how to create annotations.

# 1.15.5

- Fix to webapp to disable the context menu default when we intercept with our
  own context menu.

# 1.15.4

- New PHZ loader that's web friendly and doesn't require Electron.  The new 
  loader is now the default and means that the webapp can read (but not 
  currently) write PHZ files.  

# 1.15.3

- Merged PR to support wayland via X-wayland for ubuntu and other distributions. 

- New GA logger to incorporate errors as events that can be tracked by custom 
  category.

- Didn't include pdfjs-dist with the webapp..

- some basic new code for a direct loader for the PHZ mode

# 1.15.2

- Portable implementation of PHZs that works in the browser and handles the 
  PHZ directly within the HTMLViewer without Electron components needed.

- Fixed bad bug where text couldn't be extracted on annotations that were in 
  PDFs with large numbers of individual elements. 

- We had no analytics for the login page.

# 1.15.1     

- Fixed CSS wrap on text in GDPR notice. 

- The sidebar in the annotation view can now be viewed when the table scrolls
  and improved CSS padding + margins so that the layout is consistent.  

- Changed to a bottom bar for the comment and flashcard views.

- Fixed a bug where editing an existing flashcard type use the previous type 
  properly and a cloze could become a front/back card and vice versa.  

- Significantly improved annotation view including tab nav and filter bar.

- Improved presentation of the UX of the annotation bar by placing the 'hr' at
  the bottom not the top.

- Fixed bug with FilteredTagInput not properly yielding after selecting tags
  to filter the repository.

- New mixBlendMode thanks to @TracyPoff that properly makes texts black instead 
  of a shade of blue applied or tinted by area/text highlights.

- Fixed bug with filtered tag input just dropping the tags not giving a warning.

- New link to Polar Premium directly in the app pull down menu so that users
  can discover it easier.

- New text extraction algorithm for PDFs to pull out the text without excess 
  spacing.

- Fixed bug with highlights showing up on the wrong page.

# 1.15.0

- New major release milestone to highlight the webapp and new polar chrome 
  extensions.  

- Updated "Save to Polar" extension which uses the webapp to preview and save 
  apps as well as integrate properly with the web application and desktop. 

- Added 'preview' support to the webapp so that we can easily preview URLs

- Fixed bug in FF with the webapp no longer working.

- Now running latest version of pdf.js (from dec)

- Flashcards can now be edited properly

- Flashcards and comments are now in ascending order not descending

# 1.13.13

- sidebar and viewer properly resized now

- Comments can now be edited, not just viewed. 

- The DiskDatastore now performs more atomic operations when working with state 
  files for more reliable operations.

- Webapp users now properly get a default set of documents.

- Tour now works on webapp

- Number of fixes for the webapp including progress uploads (which also work for
desktop sync too) and multiple file uploads.  

- Cancel button for when the user tries to login but wants to back out.

- Cloze deletion flashcards now have cloze counter incremented.

- Firebase can now send progress notifications to the desktop during file 
  uploads to the cloud.

- Fixed bug with link not being hidden on desktop electron.

- New button on the top right so that users can find app updates easier.

# 1.13.12

- new auto-resume of reading which is now enabled by default.

- new prefs system for disk datastore and cloud and defaults to localstorage in
  the browser.

- We no longer show background progress updates that complete very quickly. 
  This was often distracting when the app was working in the background. 

- Fixed bug with PDF scroll into view where we wouldn't properly scroll to the 
  proper position. Now we just scroll to the page that was last pagemarked.

- We had the wrong link to the documentation.

- Update to Electron 3.1.6

- New AuthHandler system so that we can show user account information when 
  using Firebase auth.

- Cut down memory usage of the webapp from 1GB to about 200MB.  The gmail app
  is about 120MB so this isn't far off from being 'reasonable' in terms of 
  memory usage.

- Upgraded to latest versions of Firebase and Webpack

# 1.13.11

- Fixed bugs with multi-select not being able to properly pick the right 

- Tour now only works on Electron.  

- Update to Electron 3.1.5 

- Pagemarks now allow you to work through them and still can highlight and 
  create + delete annotations now without the pagemarks getting in the way.

- A number of changes needed to get the webapp version of Polar to work.

- FilePaths.basename works in the browser context now. 

# 1.13.10

- Fixed bad bug that broke capture (sorry)

- More components are PureComponent now for faster performance.

- New buttons at the top for cleaner nav.

# 1.13.9

- improved document links

- Fixed bug where the viewer tour kept coming up.

- Fixed nasty bug where the comment and flashcard text was hidden behind the 
  toolbar.

- Drag and drop of whole directories works now... Including a UI showing the 
  files being imported.  I need to include a timeout though.  

- A number of changes needed for the webapp are now merged into master.  

- Blackout when dragging files onto polar and drag to import now works.

- Fixed escape so the filtered tag input goes away.

- Fixed bugs with deleting items when they were not selected.

- added metrics for anki sync and the nr of successful and failed tasks.

- Track screen resolution size and platform name properly  

- Only show splashes when the user is online

- Upgrade to latest reactstrap and bootstrap versions.

# 1.13.8

- Should be the right amount of splashes now. 

- Analytics for the add content button. Not sure if people are capturing pages
  or not.

- I inverted the splash time cutoff in this previous previous release and it
  should be fixed now.   

- Auto app update implemented for MacOS and Windows.  There is a random delay of 
  3 days to prevent breaking clients in the wild.

- Don't rely on GA to determine the OS.  Record it ourselves.

- Enabling auto-updates in this release to keep everyone on the latest so I can
  iterate faster.

# 1.13.7

- quick release to disable another GA feature which could be greaking our 
  analytics
  
- Fixed Premium splash layout on smaller screens...

# 1.13.6

- Splash messages should be delivered to users at the right times now.

- I think I fixed a bug with tracking not working due to including 'app version'
  in the analytics data.

# 1.13.5

- multi-delete button for bulk deleting documents

- buttons in the doc repo are a bit bigger for better hit targets

- multi-column selection by checkbox now to make it a bit more obvious for 
  users to select multiple documents

- Clicking flagged or archived buttons no longer select the row which was 
  confusing.

# 1.13.4

- Preview release DID NOT load the example docs (BAD BUG)

- Now targeting header in the tour to avoid scroll.

# 1.13.3

- New tour feedback and the end of the tour.

- Only load example docs once.

- GA events for cloud login and configured 

- User-Agent was not being properly tracked and this as very important to detect
  which Operating Systems were being used.

- Fixed problem with constraining the window sizes on smaller displays like                                                                                        rep
  smaller laptops.

- Sidebar now visible by default and the setting remembered with a local pref.

- Fixed messenger and F10 and other commands that were accidentally broken in 
  this release. 

# 1.13.2

- more tour changes

# 1.13.0

- Tour of how to use Polar for new users.

- Replaced the context menu with a native React menu. 

# 1.12.1

- If we are given a path to a file during the writeFile datastore operation, we
  hard link it instead of copying it.  This is only done with file paths 
  (not data blobs) and works during PDF file import to avoid duplicate disk 
  space usage.   

- re-importing an existing file should now open it in polar instead of doing 
  nothing. 

- starting work to disabled updates for MS and Apple stores.  

- adding some newlines between markdown exported entries.

- Updated windows build with new icons. 

# 1.12.0

- Feature: Properly keep track of reading progress and update the reading
  progress metrics now.

- Feature: Ability to set the 'mode' for pagemarks now so that we can keep track
  of reading progress better.  We support various pagemark modes like read, 
  previously-read, table of contents, etc. 

- Feature: site (example.com) is now a column which you can add to the doc repo
  but isn't enabled by default.  This is used for captured content.  We may
  add this for other types of content in the future including PDFs if we can 
  get proper URLs for the content in the future.

- Feature: Double click on the pagemark progress bar now jumps to the last pagemark. This
  has been frequently requested but more specifically to have it automatically
  jump to the last position.  I'm not able to implement the automatic portion
  right away so this is a temporary work around.  My plan is to eventually put
  a button and a right click context menu when I rework some of the viewer 
  support to React.

- Feature: Now parse DOIs from PDFs and store them in the model.  This feature
  isn't really used yet but we plan to add support for fetching additional 
  metadata based on the DOI

- Feature: More descriptive text for the assignment and filtering of documents
  around tags to avoid confusing the user around creating vs filtering of tags. 
  Might still have to improve the UX here.

- Bug: Rework the way we do app exit which hopefully fixes windows bugs and
  exception on exit.

- Verified Electron 4.0.3 mostly works with Polar but only using 3.1.3 due to 
  a bug with resizing / pagemarks. 

- Bug: Logging out of cloud sync makes it impossible to login back again. #536

# 1.11.0

- more consistent header bar throughout the app.

- Pagemark batches which help working with PDFs that have multiple pages.  Now
  if you create pagemarks across pages you can delete one and the whole batch 
  is also deleted.

- Reworked analytics.  I'm expecting a 2x falloff on this release I think. 

- Fixed bug with page zoom not working properly in the HTML viewer.  The zoom 
  now works but pagemarks still aren't placed properly.

- Page number in markdown export

- Disabled the top message boxes.  They were annoying and only a stop gap until
  we have a proper onboarding mechanism.  I

- Electron 3.1.2

- Donate and Discord buttons in header.  These are important.

- Setting POLAR_DISABLE_HARDWARE_ACCELERATION should disable hardwawre 
  acceleration now if that's causing a problem for you.

# 1.10.0

- Fixed sync bug related to not sending data to the cloud but I don't think this
  was actually released.

- Fixed bug with promises not being resolved and the viewer not being updated
  but I don't think this was actually released.

- Feature: Migrated to fixed nav header

- Feature: GDPR notice in place.

- Feature: Shift selects a range of documents, control selects one document at a
  time for multiple documents at once.

- Feature: Implemented a basic exporter framework.  Annotations can now be
  exported from the sidebar.  Exporting will be improved over time with more
  features.

- Bug: Fixed (I hope) long standing ugly bug of 'crash' of Electron on app exit due
  to windows not being destroyed via destroy().  Close does not release the 
  resources properly.  

- Bug: Fixed bug where long titles in URLs could generate filenames that were too
  long and couldn't be represented on the filesystem.  We not truncate at 50 
  chars.

- Feature: New buttons for '+ Add' to import from disk or capture web page. 
  Much easier to determine how to add content to polar.

- Feature: multi-select and ability to tag multiple docs at once.

- Feature: Sorting by tags is now much better and actually works.  If you double
  click the sort column it will show you untagged documents sorted by the time
  they were added.

- Dependencies: Update to electron 3.1.1 

- Bug: Fixed bug where hitting Enter when working with a title would cause the
  page to reload.

# 1.9.0

- Create pagemark to point now works across multiple pages and ranges.  

- Fixed bad bug where the UI wouldn't update when a newly imported PDF wasn't
  immediately visible in the UI.

  This was a bad initial user experience as they would have to reload for the
  PDFs to be visible.

- Fixed major Twitter content capture bug where we weren't saving the CSS styles
  of HTML content.

- Fixed bug where VH rules that were less than 100 weren't being set properly 
  and some pages rendered ugly.

- Fixed bug with the 'deck:' tag not properly working with Anki sync.

- Importing large numbers of PDFs (and large PDFs) is now a lot faster and more
  responsive when using cloud storage.  In the past we used to wait until the 
  cloud layer was finished but this takes a long time to complete.

- Now using 'localhost' instead of 'localapp.getpolarized.io' for the hostname.
  Some users weren't able to resolve this (not sure why) and additionally 
  working offline didn't function either.

# 1.8.0

Major changes:

- PDFs auto-import when trying to share them from the browser.

- Refactored the rich text editor so the bar at the top is no longer in 'air' 
  mode so that users can realize that it supports rich text.

- support for cloze deletion

- Stats view for core stats  

- New logs view to show logs as they're being written which can help users 
  debug issues with Polar and report problems to the dev team plus understand
  what's happening with their data.

- Related tags in the tag selector

- 'capturing' a PDF from the browser now works and the PDF is then saved into 
  the repository.

- Copy URL to clipboard shows toaster that the URL was copied successfully.

- Reveal file in finder (or Explorer on Windows) 

- Copy file path to clipboard.

# 1.7.0

- New annotations view to see all your annotations in one place.

- New sidebar to expand contract to show other pages within polar 

- New option to create a pagemark at the mouse point.  Still more work to make
  the key bindings visible.

- Adding forced CSS for ::selection so that sites that have broken CSS for 
  highlighting don't actually break polar and we also have consistent highlight
  support.

- Fixed some navigational issues in the web capture system. 

- Fixed bug the annotation bar in PDF where resize will kill it.  Hopefully the 
  last bug there.

- Backend changes to support cloze deletions in anki.

# 1.6.0

- Fixed possible regression due to using SVG icons as these broke the app repo
  and possibly a few other issue.

- Re-add uncaught exception handlers on app exit.  Hope to fix the issues we were
  having with exceptions on app exit.

- Completely new annotation bar for highlighting which should fix a major bug 
  with the PDF mode.

- Fixed some fonts + css with the sidebar.

- Improved indeterminate progress bar on MacOS and just better in general 

- Print the version numbers for updates.

- Fixed quote mangling due to improper UTF-8 handling.  

- Hopefully fixed high CPU bug on Windows caused by shutdown and attempting to 
  double-close windows. 
 
- Sending analytics for number of invitations sent

- Implemented Control+Enter for creating comments.  

- Making tags + updated + added columns visible by default for new users.   
  I think some people did not discover it by default.

# 1.5.1

- change the button color of the capture button so that it's obvious what to 
  click for new users

- hopefully/finally fixed issue with the annotation popup bar in PDFs. 

- tab keyboard nav works for flashcards

- control+enter works to create flashcards

- escape hides the tag input

- control+enter works for tag input

# 1.5.0

- Cloud sync implemented based on Firebase.

- Fixed progress bars on MacOS which looked rather ugly.

- Fixed issue with highlighter popup becoming disabled with PDF.

- Dozens of other smaller features and fixes integrated.  This is a big release.

# 1.1.1 

- Fixed bug with not loading all documents properly on startup.

# 1.1.0

- New Splash system to keep customers engaged with Polar growth and marketing.
  We only display a few messages and only on startup. I don't want these to be 
  annoying. 

- Tested to verify the published chrome URL works with the version of Chrome we
  are about to ship.

- Support for our new chrome extension.

- Disabling amp for now until we have a better solution on how to show the user
  that an AMP page is displayed and how to disable / enable it.  Otherwise its
  confusing and often the amp page is WORSE not better.

- Fixed bugs with the browser size not changing during capture browser changing
  and also fixed some issues with it not properly accepting the browser change 
  in some situations.  

- Fixed bug in HTML zoom where the page would be truncated improperly.

- Blocked amp ads during the capture but they aren't blocked during the preview 
  at the moment.

- "Fixed" nasty anti-aliasing bug in electron by blocking amp ads. They were 
  annoying anyway but for some reason they were breaking chrome rendering - 
  probably due to some web component nonsense.   

- Implemented a new strategy with the vertical height algorithm in the capture 
  system to revert it back to auto instead of a fixed max-height.  Works a lot
  better now.  

- Date/times no longer include ' ago' to be a bit more concise.

- Basic initial version of AppPath which can be used to load apps via HTTP now.

- The data transfer from the disk store to the firebase store works which means
  we're very close to having a full cloud implementation of sync.

- Made the VH 100 fix for capture more picky 

- Added small FAQ entry to enable Anki sync.

- Fixed a bug where we could select text and not properly work with elements.

- Renderer analytics didn't understand that a callback without an error wasn't 
  a failure.
  
- Upgraded a number of important react packages:

    react react-dom react-moment react-select @types/react-table 
    @types/react-select @types/react @types/prop-types @types/node-fetch

- removed inversify package (were not using it)

- latest fontawesome

- latest node-fetch

- fixed issue with electron-builder where it was forcing us to upgrade to the 
  latest version for each release. 

# 1.0.14

- Upgrade to latest semver and firebase-tools 

- Fixed bug where the lightbox was kept enabled after we deleted an annotation

- We can now capture a new class of documents that use a vertical height on 
  their CSS selectors. 

- We can now capture XML documents which used XSL stylesheets.

- Major refactor of the disk datastore for the pending cloud sync functionality
  we're working on. 

# 1.0.13

 - point release to fix auto-updates in release process and upgrade 
   electron-builder and electron-updater

 - migration from typescript 3.0.3 to 3.1.6 due to incompatibility to with new 
   electron-builder

# 1.0.12

- Reduced the minimum mouse click duration required for bringing up the annotation 
  bar. 

- Fixed bug with Electron generating an error window on exit due to a conversion 
  of the wrong type to an integer.  This was/is an Electron bug.  This may not
  be fixed in all situations but it's much better than it was before.

- Feature: drag and drop for bulk PDF import works. 

- Upgrade to Electron 3.0.8

- Fixed analytics around number of documents in the repository

- Feature: The "Delete" text is now danger red.  

- Feature: Implemented a confirm prompt when deleteing flashcards, comments, and
  annotations.
 
- Feature: Implemented Cancel when creating flashcards and comments 

- Feature: Reworked anki sync to run from the doc repository.  

- Feature: Renamed "Copy URL" to "Copy Original URL"

# 1.0.11

- release to fix MacOS certificate bugs

# 1.0.10

- banner message about opencollective donations

- Change capture key binding to CommandOrControl+N (new).  The other key binding 
  conflicted with window management in Chrome and we might want to use those
  key bindings in the future.

- STASH files can be added directly as a backend file just like images and video
  which means that they could work with the future firebase store.  

- refactored the way we're handling popups for the annotation bar.  I think this
  will resolve most of the issues we're having but there are still a few more 
  glitches to be fixed.  

- If any of the input tags were invalid, they were ALL ignored.  Which is bad.

- Fixed ugly bug where percentags can be > 100% but only slightly.

- reworked the preview browser so that buttons are only enabled after you first
  load a URL so that it's not confusing for the user.

# 1.0.9

- release to fix MacOS release breakage.

# 1.0.8

- ability to enable fetching the auto-update from a pre-release

- the capture preview now expands the content once it's loaded.  One issue here 
  is that some documents appear too long.  I think it is an issue with computing
  the scroll height reliably and I'm still figuring this part out. 

- when capture preview is running we now set a title

# 1.0.7

- another release to fix Windows by upgrading sentinel

# 1.0.6

- changes to analytics and a rapid release for fixing Windows. 


# 1.0.5 

- more browsers for larger documents (desktop).

- link to discord in the menu box.

- emit an event for the number of documents loaded in the document repository

- Snaps should be supported now.  No more segfaults.

- Annotation sidebar now supports:
    - delete flashcard + comment
    - delete text annotation
    - menu for text-annotation to create flashcard + comment

- Capture now has a key binding: CommandOrControl+Shift+W

- Text highlights no longer being saved to JSON.. migrating them to the file 
  repo...

# 1.0.4

- Tags are stored with anki notes now.  They weren't before but they're critical
  to making our anki support work better. 

- We now have a basic but imperfect settings systems that allows us to persist
  various changes locally .. Will need to be refactored a bit in the future to
  make it more MVC and to work better with react.

- nr of annotations column to show / highlight documents which are annotated
  most.

- tags column which isn't enabled by default.

- improve double click handling to make sure we have a set of isolated single 
  click columns.

- merged PR from xuebingli to handle double click on columns intended to be 
  single click. 

    https://github.com/burtonator/polar-bookshelf/pull/303

- Fixed a bug where some pages weren't properly expanding when they were first
  loaded. 

- Fixed GA tracking of events which weren't sending before. Need this to 
  determine which features are being used.   

- Ability to click on the pulldown in the document repository to the right and 
  copy the URL for a document that was captured.

- Fixed bug where capture wouldn't generate a completely unique URL for storage
  on the file system and if you captured two URLs with the same title the 
  later one would update the former one.  We now include the a hash prefix of
  the SHA384 in the filename for uniqueness.

# 1.0.3

- Put ToS, cookie policy, and privacy policy in the about links so that people
  can get access to these easily.

- Super fast double click on text no longer brings up the annotation box.  Only
  more explicit highlights where the suer drags their mouse.

- Webaudio is enabled now. I had disabled it before as it's annoying when
  capture is running but we need it for video support to work properly.  

- PHZ files were not actually being compressed. Just stored.  Weird bug with 
  the API in jszip which made it easy to accidentally disable compression.  
  PHZ files will be 3x smaller in this release.    

- Upgraded to the latest sentry. I think there snap bug is related to sentry 
  but I'm not sure yet.  The snap packages weren't working but maybe they will
  in this release. 

- Upgraded to latest packages:
    - firebase
    - react
    - split.js
    - reactstrap

- Anki now properly uses the deck: tag when writing to decks.

- Initial support for Youtube video embeds.  We had NO support for youtube in 
  the past so even though this is minimal it's better than what we currently 
  have.

# 1.0.2

- The delete document prompt now has a subtitle to note that you will also lose
  the annotations.

- Border around the webview so you can see which part of the page is the doc.

- On OS X it's common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open. The way
  we handle this now is that if there are no windows open we re-create
  the document repository so they can select one. Otherwise we just
  re-focus the most recently used window.

- Deleting documents in the UI app repository is implemented.

- Deleting documents from the repository via API is implemented.

- Upgrade to latest reactstrap 

- Show the data dir path when loading help | about so that people can easily
  figure out where their data is being stored.

- Ability to set titles for documents in the doc repository

- Using Electron 3.0.4

# 1.0.1

- This build should make manual auto-updates work. 

- Fixed a bug with some PDFs not opening properly

- Fixed bug with split.js by upgrading and also fixed some issues with rendering
  the page initially with split.js which caused it to re-snap and re-center
  itself.

# 1.0.0

- calling this version 1.0.0.  We are mostly feature complete.  There are a few
  things lacking but this way we can start getting more feedback as we're very 
  stable and people shouldn't assume the app is beta just becuase we're lacking
  a few features.

- Zip target was not provided for MacOS so auto-update was not working. 
  Hopefully it will in the next release.
  
- started adding the infra to add file attachments to the store 

# 1.0.0-beta211

- using persistent sessions now so GA metrics should be more accurate

- message on the top of the doc repo so I can start using the polar user base 
  more aggressively to help us out and contribute as a group.  

- improved the look of the sidebar a bit...

# 1.0.0-beta210

 - new 'toggle annotation sidebar' for the viewer mode.
 
 - manual updates might be set
 
 - more GA changes so I can track and improve polar usage

# 1.0.0-beta200

 - multiple color highlights
 
 - you can now jump from annotations in the sidebar to the part in the document
   where that annotation lies
   
 - annotation bar which pops up when you select text.
 
 - document repository now has last updated column
 
 - document repository now prints a better date format by default.  

# 1.0.0-beta190

 - all future releases will automatically make it into snap and this is now a 
   supported platform.

 - DMG file size down from 300MB to 111MB.  

 - The user can now change browser profiles and change to two new profiles for
   desktop browsers. 

 - Fixed bug where some pages wouldn't load properly in capture due to module
   resolution conflict. 
 
 - Fixed security issue. Please upgrade.  
 
 - Windows binaries should now be signed!

# 1.0.0-beta180

- Mac OS builds are now signed.

- New capture browser bar that is much prettier and more usable than the current
  browser bar and based on react.
  
- new / updated capture system allows the user to change the device being 
  emulated for pages that are tricky to capture.

- Updated large number of dependencies

- Electron 3.0.0

- new (initial) annotation sidebar for navigating and creating additional 
  annotations. 

# 1.0.0-beta170

- New tagging UI for the repository. Documents can have tags and and properly 
  filter them.  Tags follow twitter hashtag constraints.  

- Fixed issue with circular structure when logging.

- Fixed document repository corruption bug

# 1.0.0-beta160

- Fixed corruption issue regarding the store when two documents are open and one
  is updated.
  
- Using intercept stream protocol instead of intercept buffer protocol. Should
  fix a number of major problems regarding capture.
  
- Fixed capture issue around document corruption and some races after capture
  launched.

# 1.0.0-beta152

- Fixed potential race creating directories

- new build targets to make a new / local deb/snap without pushing them.

- Fixed bug if a single DocMeta file is broken

- Update to Electron 3.0 beta 12.

# 1.0.0-beta150

- new browser based capture system.

- Fixed bug where we could accidentally put the user in a situation where they
  can lock themselves out of the document repository.

# 1.0.0-beta141

- Fixed issue with repository generating errors when no files were in the repo

- Fixed issue with Files API returning empty exceptions which prevented debugging
  when in production.
  
- We now write errors to ~/.polar/logs/error.log which should make it easier for 
  users to help us find problems in production.

# 1.0.0-beta140

- Electron 3.0 beta 10

- Document Repository now supports the following features:

    - flagging files 
    - archiving files
    - filtering files by flagged only
    - filtering files to hide archived files.

# 1.0.0-beta133

- improved spectron tests
- migrated to chai everywhere for assert
- more windows bug fixes.

# 1.0.0-beta132

- Fixed hopefully the last Windows issue. This was due to not awaiting a promise
  where on Linux it was unnecessary.

# 1.0.0-beta131

- Fixed a major Windows regression in pagemarks.

# 1.0.0-beta130

- AHA.. We were not using Electron 3.0 beta8.. we were still stuck on beta5 
  due to an electron-builder issue. 

# 1.0.0-beta129

- Improved how we create TextHighlight to avoid type issues.

- Notes and Questions properly typed

- BaseHighlight.rects properly typed now. 

- TextHighlight properly using string | Text for the text of a highlight.

- FAQ updated for how to enable advanced logging.

- FAQ updated to build from source. 

- Fixed logging issue where we might have been swallowing an uncaught exception.

- Fixed bug where Polar is running and the user double clicks on the app again
  and nothing happens.

- Removed # in URL for sync app since it's no longer needed and prevented
  execution on Windows.

- Re-launch the app repository if polar is already running and the user clicks
  on the desktop icon.

# 1.0.0-beta128

- Updated logging to include the path when we can't open an AppPaths relative file.  

# 1.0.0-beta127
 
- Fixed a half dozen path separator bugs on Windows.

- Fixed potential Windows bug when importing PDF files into the repo and working
  with files in general.

# 1.0.0-beta126

- Sending error traces to Sentry

# 1.0.0-beta125

- Fixed more platform issues on Windows

# 1.0.0-beta120

- Fixed a number of important bugs with Windows

- Screenshots are now taken when text highlights are created.

- Improvements to HTML content generation when copying from the document.

- new Screenshots and Attachment support for object model. 

- crash reporter enabled for backtrace.io but only in a basic scenario.

- the renderer can write directly to disk now which improves performance

- Updated to beta 8 of Electron 3.0

- Spectron tests sort of working again.

- More data copied from the PHZ to the DocMeta including URL and filename.

- If you open a PDF file off disk it's imported into the stash now.

- Major logging system improvements. 

# 1.0.0-beta110

- If the PHZ file is wider than the window we're loading in we now expand the 
  window.

- Snap file distribution disabled at the moment. They don't work properly and 
  I need to take the time to build them correctly.  We have tar.

- Offset given to new windows so that it's not confused with the previous window.

- Better logging for additional performance. Default log level is INFO bug we 
  can change it later to WARN.  Include the source of the log event and the log
  level in messages now.  

- new document repository UI as standard. Supports viewing your documents as a 
  queue based on time, progress, filtering by document title, sorting by document,
  pagination of the documents in your repository, and double clicking to open 
  a document.

- AppAnalytics now sends userAgent to Google Analytics so we can track OS, 
  Browser version, app version, etc.  

- re-enabled opening a file from the command line.

- Started work on screenshots which are now disabled by default.  When you take
  a highlight the screenshots are stored as part of the annotation for future
  reference.   

- Went through and upgraded all apps to make sure electron-log was enable and 
  working properly.

- now using electron-log as our logger by default.  We now log to .polar/logs 
  and consolidate all the window log lines into one location.  This way users
  can debug their problems easier.

- big refactor of the main app into smaller components. Code is much more 
  manageable now.
  
- update electron-log version      

# 1.0.0-beta103

- deleted some of the pdf.js nav links as they were broken for the most part.

- Removed errant link to jquery-ui which was being fetched and probably slowing
  down the initial page load.

# 1.0.0-beta102

- Fixed Windows builds to have proper files for the .exe. Setup tested and it 
  works properly now. 

# 1.0.0-beta100

- Capture now using webview by default for captured content. Should be much much
  more reliable and usable. Prevents crashes on Linux.
  
- Windows builds now dramatically smaller.  From 300MB down to 75MB.  

- Migrated to ASAR builds which should significantly improve performance on Windows
 
- 64bit and 32bit Windows builds now available.

- Capturing now more reliable if it is aborted by the user.  Electron used to
  lock up.   

- Initial Anki sync working

- Flashcard input now fully working.  

- Ability to set titles for a document

- Initial support for pagemarks that can be 'ignored' and have a state so that
  you can say that you're ignoring a whole section of a doc and not that it's 
  been 'read'.

- Image sync works for Anki and we properly handle media files.

- Better integration with your primary browser. If you click on a link in a 
  captured page it opens in your browser.

- Started work on a video implementation to create notes+flashcards while watching
  a youtube video and keeping track of progress while watching it.  Will take a 
  while to have an implementation of this feature ready. 

# 1.0.0-beta10

- ability to easily toggle the devtools.

- --enable-dev-tools command line arg for starting with the dev tools already running

# 1.0.0-beta9

- reworked command line handling so that PDFs that are opened from the command
  line are opened in a new window.

- new "Open in New Window" menu option so that we can work with multiple PDF
  files.

# 1.0.0-beta8

- New windows were always maximized which was difficult to work with.

- Support opening multiple windows now.  We were constrained to just one window
  before.

# 1.0.0-beta7

- All PDF files are served via HTTP and webapp served via HTTP too which avoids
  some pdf.js bugs.
