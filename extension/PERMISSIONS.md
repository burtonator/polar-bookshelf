# List of chrome permissions and why we request them.

We understand that importance of your privacy and 

The Polar chrome extension is Open Source and can be aud

## webNavigation 

"receive notifications about the status of navigation requests in-flight."

Used so that we can intercept PDF downloads and HTTP requests for loading Polar 
desktop or web application if necessary.

## webRequest

Used with webNavigation to handle PDF downloads and in the future handle other
formats as well.

## webRequestBlocking

Used because we can't redirect to PDF without the API for webRequest being blocking. 

## documentScan

Used so that we can detect scanners in the future to upload PDF content to Polar.

## fileBrowserHandler

"Use the chrome.fileBrowserHandler API to extend the Chrome OS file browser. 
For example, you can use this API to enable users to upload files to your website."

Not actively used but we're planning on using it to extends file uploads on 
Chrome OS in the future.

## identity

Used so that in the future we could make it easier or users to manage the browser
identities they're using with Polar.

## idle

Uses so we can detect when the users computer is idle to perform background
operations and not waste resources.  

Status: Not actively used.

## notifications

Used to show users notifications in the system tray if necessary.

## storage

Used to provide a better API than localStorage specifically the async behavior

## tts

Used to request access to the text to speech system.

## geolocation

Used (optionally) to request the users location to include where they have 
captured the content as well as to discovery what other users are actively 
sharing in their area.
