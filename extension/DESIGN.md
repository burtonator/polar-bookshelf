# Automatic PDF handling

- we add the CORS headers that polar needs directly by looking at the origin and
  verifying that they match up.

## webRequest

https://developer.chrome.com/extensions/webRequest

We're using the web request API to handle this.

## TODO

- Do not activate on our OWN PDFs URLs served from google cloud storage and
  mangle them... otherwise this is incompatible with our use case.  I think 
  that since we're just adding the proper headers that it should work fine but
  test it.

- Verify that file URLs work

- There should probably be a 'download' button the user can use to DL the PDF 
  locally.

- I think in practice this functionality is TOO HARD to implement and might be 
  impossible.
  
    1. we can't change the response from the OPTIONS response and some servers 
       will just return a 500.
       
    2. HTTP/HTTPS schemes, when mismatched, will return mix-content errors.  I 
       think the only way to do this could be to use the new caches API and 
       then a stream and then stream the data into the cache but this opens 
       up even more issues because it's difficult to implement, new, and might
       not work on other browsers.


- OK.. in theory it should work BUT probably only within a chrome extension so 
  we would have to bundle up our entire webapp as a chrome extension and serve
  it there which would work fine of course so we could go down that route in 
  the future.
  
   - we would have to automatically build and push the web extension as part of 
     CI distribution and it would constantly be 1 week old - unless it 
     auto-updated itself which might be a violation of ToS.
    

# Page Capture

Web page capture is done by sending a message to the background 

https://developers.chrome.com/extensions/messaging#external

## Capture Visible Tab

https://developer.chrome.com/extensions/tabs#method-captureVisibleTab

Handles capturing the entire tab screen.  We can probably crop this in extension 
so that we can send less data:

And responding to the message after the screen is captured.

## Notes

### Image cropping

- Once I have the binary data do this inside a canvas directly and I have
  functions to do this in Canvas.ts

### Binary data

Chrome extensions CAN NOT send binary data:

https://developers.chrome.com/extensions/messaging

> A message can contain any valid JSON object (null, boolean, number, string,
array, or object).

# TODO

- add content capture to the chrome extension.

- the TSC compiler is fucking up because it sees node_modules and is importing 
  types from them and then get version differnces. 

- npx tsc --traceResolution |grep node_modules |grep " use it as a name resolution result." |grep -v extension
