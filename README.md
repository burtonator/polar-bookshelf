<p align="center">
    <img src="https://github.com/burtonator/polar-bookshelf/blob/master/icon.ico" width="256">
</p>

<div align="center">
  <h1>Polar Bookshelf</h1>

<a href="https://github.com/burtonator/polar-bookshelf/releases">
     <img src="https://img.shields.io/github/downloads/burtonator/polar-bookshelf/total.svg"/>
</a>

<a href="https://discord.gg/GT8MhA6">
    <img src="https://img.shields.io/discord/477560964334747668.svg?logo=discord"/>
</a>

<a href="https://github.com/burtonator/polar-bookshelf">
    <img src="https://img.shields.io/github/stars/burtonator/polar-bookshelf.svg?style=social&label=Star"/>
</a>

<a href="https://twitter.com/getpolarized?ref_src=twsrc%5Etfw">
    <img src="https://img.shields.io/twitter/follow/getpolarized.svg?style=social&label=Follow"/>
</a>

<a href="#backers" alt="sponsors on Open Collective">
<img src="https://opencollective.com/polar-bookshelf/backers/badge.svg" />
</a> 
<a href="#sponsors" alt="Sponsors on Open Collective">
<img src="https://opencollective.com/polar-bookshelf/sponsors/badge.svg" />
</a>

<br/>
<br/>

<!--

<a href="bitcoin:bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g" title="Donate"><img src="./docs/icons/bitcoin.svg" width="48" height="48"></a>
<a href="https://discord.gg/GT8MhA6" title="Discussion"><img src="./docs/icons/discord.svg" width="48" height="48"></a>

<b>Bitcoin Donations: </b> <a href="bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g">bc1q059asaaqjt5cultx993gfytjssj4g6fw3q8n7g</a>
<br>
<a href="https://discord.gg/GT8MhA6">Discord Discussion</a>

https://discord.gg/qp5FsY

[![Reddit](https://img.shields.io/discord/307605794680209409.svg?style=flat-square)](https://www.reddit.com/r/PolarBookshelf/)

[![Discord](https://img.shields.io/discord/307605794680209409.svg?style=flat-square)](https://discord.gg/yAA8DdK)
[![Travis](https://img.shields.io/travis/wexond/wexond.svg?style=flat-square)](https://travis-ci.org/wexond/wexond)
[![AppVeyor](https://img.shields.io/appveyor/ci/Sential/wexond.svg?style=flat-square)](https://ci.appveyor.com/project/Sential/wexond)
-->

Polar Bookshelf is personal knowledge repository which supports advanced
features like incremental reading, annotation, comments, and spaced repetition. 
It supports reading PDF and the web content and was created using the [Electron
framework](https://electron.atom.io) and
[PDF.js](https://mozilla.github.io/pdf.js)

</div>

# Features

- **PDF support** We have first-class PDF support thanks to <a href="https://mozilla.github.io/pdf.js/">PDF.js</a>.  PDFs work well when reading content in book format or when reading scientific
research which is often stored as PDF.

- **Captured Web Pages** Download HTML content and save them as offline documents which can be annotated.

- **Pagemarks** Easily keep track of what you're reading and the progress of each document.

- **Text Highlights** Highlight text in PDF and web pages.

- **Area Highlights** Capture a region of the page as a highlight which can be a chart, figure, infographic, etc.  

- **Local Storage** All content is stored locally. 

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

![Repository](https://raw.githubusercontent.com/burtonator/polar-bookshelf/master/docs/screenshots/repository-shadow.png)

<p align="center">
    <b>Repository</b> Polar includes a document repository manager to manage all
    your documents, open up a new editor, sort them as a queue or by priority,
    etc.
</p>

# [Downloads](https://getpolarized.io/download.html)

Packages for Windows, MacOS, and Linux are available on the [downloads](https://getpolarized.io/download.html) page.

We also have a [CHANGELOG](./docs/CHANGELOG.md) available if you're interested into what went into each release.

# Discussion

We have both a [Discord](https://discord.gg/GT8MhA6) group and
[Reddit](https://www.reddit.com/r/PolarBookshelf/) group if you want to discuss
Polar.

If it's a very technical issue it might be best to [create a Github Issue](https://github.com/burtonator/polar-bookshelf/issues/new). 

# Personal Knowledge Repository

Polar is a document manager for PDF and web content as well as a personal
knowledge repository.

Polar allows you to keep all important reading material in one place including
annotations and flashcards for spaced repetition.

It supports for features like pagemarks, text highlights, and progress tracking
by keeping track of how much you've read including restoring pagemarks when you
re-open documents.

Pagemarks are a new concept for tracking your reading inspired from [incremental
reading](https://getpolarized.io/incremental-reading.html).  They allow suspend
and resume of reading for weeks and months in the future until you're ready to
resume, without losing your place.

Since you can create multiple pagemarks they work even if you jump around in a
book (which is often in technical or research work).

# Web Content

PDF is an excellent document format but we've found that many HTML pages don't
convert to PDF well since they were not intended to be printed.

Captured pages contain HTML content stored in ```phz``` (Polar HTML zip) files.

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

To specify the Anki deck for a document, add a tag starting with `deck:`.  Slashes are used to specify subdecks.
For instance, to set a document to the Anki deck ML::100PageMLBook, use the Polar tag `deck:ML/100PageMLBook`.


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
you would like to add. [Here](https://github.com/burtonator/polar-bookshelf/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) is a list of good newcomer issues.

# Data

All data is stored on disk in JSON format.  This also includes extracted metadata
from the document.  For example, text highlights include the source text that you
copied as well as pointers into the original document where they can be found.

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

Install latest **stable** node and npm versions.

You can check which version you need at 

https://nodejs.org/

... then run: 

```
$ git clone https://github.com/burtonator/polar-bookshelf
$ cd polar-bookshelf
$ npm install && npm run-script compile && npm start
```

# Donations

Polar is supported by [community donations](https://opencollective.com/polar-bookshelf) 

All donations  go to supporting Polar which include website hosting costs, web designer costs, continual integration services, etc. 

## Contributors

This project exists thanks to all the people who contribute. <img src="https://opencollective.com/polar-bookshelf/contributors.svg?width=890&button=false" />

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/polar-bookshelf#backer)]

<a href="https://opencollective.com/polar-bookshelf#backers" target="_blank"><img src="https://opencollective.com/polar-bookshelf/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/polar-bookshelf#sponsor)]

<a href="https://opencollective.com/polar-bookshelf/sponsor/0/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/1/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/2/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/3/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/4/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/5/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/6/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/7/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/8/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/polar-bookshelf/sponsor/9/website" target="_blank"><img src="https://opencollective.com/polar-bookshelf/sponsor/9/avatar.svg"></a>

# License

Polar is distributed under the GPL license.  

[PDF.js](https://github.com/mozilla/pdf.js) is available under  Apache License.
[Electron](https://github.com/electron/electron) is released under MIT License.
Rest of the code is MIT licensed.

<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>


