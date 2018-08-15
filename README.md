<p align="center">
    <img src="https://github.com/burtonator/polar-bookshelf/blob/master/icon.ico" width="256">
</p>

<div align="center">
  <h1>Polar Bookshelf</h1>


<a href="bitcoin:bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g" title="Donate"><img src="./docs/icons/bitcoin.svg" width="48" height="48"></a>
<a href="https://discord.gg/GT8MhA6" title="Discussion"><img src="./docs/icons/discord.svg" width="48" height="48"></a>


<!--

<b>Bitcoin Donations: </b> <a href="bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g">bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g</a>
<br>
<a href="https://discord.gg/GT8MhA6">Discord Discussion</a>

https://discord.gg/qp5FsY

[![Reddit](https://img.shields.io/discord/307605794680209409.svg?style=flat-square)](https://www.reddit.com/r/PolarBookshelf/)

[![Discord](https://img.shields.io/discord/307605794680209409.svg?style=flat-square)](https://discord.gg/yAA8DdK)
[![Travis](https://img.shields.io/travis/wexond/wexond.svg?style=flat-square)](https://travis-ci.org/wexond/wexond)
[![AppVeyor](https://img.shields.io/appveyor/ci/Sential/wexond.svg?style=flat-square)](https://ci.appveyor.com/project/Sential/wexond)
-->

Polar Bookshelf is an incremental reading and personal knowledge repository for
PDF and the web created using the [Electron framework](https://electron.atom.io)
and [PDF.js](https://mozilla.github.io/pdf.js)

</div>

# Features

- **PDF support** We have first-class PDF support thanks to <a href="https://mozilla.github.io/pdf.js/">PDF.js</a>.  PDFs work well when reading content in book format or when reading scientific
research which is often stored as PDF.

- **Captured Web Pages** Download HTML content and save them as offline documents which can be annotated.

- **Pagemarks** Easily keep track of what you're reading and the progress of each document.

- **Text Highlights** Highlight text in PDF and web pages.

- **Area Highlights** Capture a region of the page as a highlight which can be a chart, figure, infographic, etc.  

- **Local Storage** All content is stored locally. You can also use a system like ```git``` or ```Dropbox``` to transfer your repository across machines.

- **Hackable** The entire system is based on ```Electron```, ```Node```, ```pdf.js```, ```React``` and other web standards.  If you're a developer - welcome home!

- **Standards Based** All content is stored as JSON in a well documented schema.  Annotations never mutate the original content.

- **Portable** Run across any platform. ```Linux```, ```MacOS```, and ```Windows``` supported.  We also product snaps which means you can install our ```.deb``` files on ```Ubuntu``` or ```Debian``` but also any ```Linux``` distribution that supports snaps!

# Screenshots

<img src="https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/pdf-loaded-shadow.png" align="center" title="PDF" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);">

<p align="center">
    <b>PDF Document</b> Polar has excellent PDF support.
</p>

![Captured Web Content](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/captured-web-content-shadow.png)

<p align="center">
    <b>Captured Web Content</b> Polar supports fetching and storing web content locally for annotating.
</p>

![Annotations](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/annotations-shadow.png)

<p align="center">
    <b>Annotations</b> Annotating a PDF including pagemarks showing content already read, an area highlight, and a text highlight.
</p>

# [Downloads](https://github.com/burtonator/polar-bookshelf/releases)

Packages for Windows, MacOS, and Linux are available in the [releases](https://github.com/burtonator/polar-bookshelf/releases) page.

# Personal Knowledge Repository

Polar is a document manager for PDF and web content as well as a personal
knowledge repository.

It allows you to keep all important reading material in one place including
annotations and flashcards for spaced repetition.

It supports for features like pagemarks, text highlights, and progress tracking
by keeping track of how much you've read including restoring pagemarks when you
re-open documents.

Pagemarks are a new concept for tracking your reading inspired from [incremental
reading](https://en.wikipedia.org/wiki/Incremental_reading).  They allow suspend
and resume of reading for weeks and months in the future until you're ready to
resume, without losing your place.

Since you can create multiple pagemarks they work even if you jump around in a
book (which is often in technical or research work).

<a href="https://www.youtube.com/watch?v=OT3qLhMK6Zk"><img src="https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/demo.png?1=2"></a>

# Web Content

PDF is an excellent document but we've found that many HTML pages don't convert
to PDF well since they were not intended to be printed.

Captured pages contain HTML content stored in ```phz``` (polar HTML zip) files.

We fetch all resources, render the page as DOM and apply CSS, then de-activate
the page by removing all scripts.

We then store the content in the phz archive format and serve the content
directly to Electron.

This means you have long term storage for all your content. You can annotate it
and use pagemarks without risk of the content changing.

To capture a new page just select ```File | Capture Web Page``` then enter a
URL.

After that the page will be captured and then loaded.

# Local Storage

All annotations, documents, PHZ files and other data are persisted on disk in
your ```~/.polar``` directory (different on each platform) and when you re-open
a PDF or PHZ file your pagemarks and other annotations are restored.

Since storage is local you're not reliant on one specific cloud provider. You can 
also use tools like git or Dropbox to synchronize across machines.

# Pagemarks

Pagemarks provide a way for you to keep track of your reading by marking portions
of your document as 'read'.  You can have multiple pagemarks per document. 

Additionally there is a progress bar that tracks the progress of the document
based on the number of pagemarks you've created.

Right now usage is only via keyboard bindings:

## Linux / Windows key bindings

 - Control Alt N - create a new pagemark on the current page
 - Control Alt click - create a pagemark on the page up until the current mouse click
 - Control Alt E - erase the current pagemark

## MacOS Key bindings

 - Meta-Command N - create a new pagemark on the current page
 - Meta-Command click - create a pagemark on the page up until the current mouse click
 - Meta-Command E - erase the current pagemark

# Text Highlights

![Text Highlight](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/text-highlight-shadow.png)

Text highlights allow you to work with content like you're using a text
highlighter in a book.

## Create a text highlight.

Select text you want to highlight then hit Ctrl-Alt-T

## Delete a text highlight.

Right click the highlight and select delete.

## Key bindings:

 - Ctrl-Alt-T - create a new text highlight from the current selected text.


# Area Highlights

![Area Highlight](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/area-highlight-shadow.png)

Area highlights allow you highlight a figure, infographic, or anything visual 
in a document. 

## Create an area highlight.

Right click on a page and select "Create area highlight"

## Delete an highlight.

Right click the highlight and select delete.

# Flashcards

![Flashcards](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/flashcard2-shadow.png)

Flashcards allow you to retain information long term by using a spaced repetition 
system like Anki to continually re-train yourself on material you want to retain.

Flashcards can be created by right clicking an annotation and selecting 
"Create Flashcard".  The resulting flashcards are stored as annotations in your 
repository.

## Status

This is currently a beta feature and we're working on implementing Anki sync
to enable spaced repetition. Any flashcards created now will be stored with
Anki in the future.

Polar is very reliable to use for day to day PDF and web content annotation.

We're expecting to release a 1.0 in Sept 2018 with Anki sync support and initial
annotation support.

# Hackable

Since the entire platform is based on Electron (Node + Chromium) the platform
is very easy to work with which means developers can contribute easily.

Feel free to fork and send a pull request if there's some interesting feature 
you would like to add.

# Data

All data is stored on disk in JSON format.  This also includes extracted metadata
from the document.  For example, text highlights include the source text that you
copied as well as pointers into the original document where they can be found.

# Pending Features

We're currently working on landing a few key features which are halfway
implemented including:

- A rework of text highlights for PDFs

- Thumbnails of highlights (text + area) stored in .json

- Flashcard integration with Anki support. The flashcard UI is mostly complete
  but I need feedback on the design.

# [Roadmap](./docs/ROADMAP.md)

Check our our [roadmap](./docs/ROADMAP.md) to see if there are any features you 
need pending for a future release.  

Feel free to jump on any of these issues if you're a developer and would like
to implement them yourself.

Donations also help to support the project and encourage specific features.

# Principles

We believe the following design principles are core to seeing this as a
successful project.

- All the data should support long term file formats.  The on disk format we
  use is JSON.

- Portability to all platforms is critical. We're initially targeting Linux (Ubuntu),
  MacOS, and Windows.  You shouldn't have to pick a tool, which you might be
  using for the next 5-10 years, and then get stuck to a platform which may
  or may not exist in the future.

## Build from source

Install NodeJS and npm for your platform.

### To run:

```
$ git clone https://github.com/burtonator/polar-bookshelf
$ cd polar-bookshelf
$ npm install && npm start
```

# Donations

If you'd like to donate we accept Bitcoin at <a href="bitcoin:bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g">bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g</a>

All donations go to supporting Polar which include website hosting costs, web designer costs, continual integration services, etc. 

# Discussion

We have a [Discord server](https://discord.gg/GT8MhA6) if you would like to discuss Polar with other users.

You can also create a Github issue if you have something more complicated. 

# License

Polar is distributed under the GPL license.  

[PDF.js](https://github.com/mozilla/pdf.js) is available under  Apache License.
[Electron](https://github.com/electron/electron) is released under MIT License.
Rest of the code is MIT licensed.

<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

[![Analytics](https://ga-beacon.appspot.com/UA-122721184-2/)](https://github.com/igrigorik/ga-beacon)
