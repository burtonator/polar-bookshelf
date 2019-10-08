# TODO



- I'm going to have to break out some operations like follower counts into 
  admin functions which are generated on the backend.  

- how do I suspend a users account from uploading when they have hit their 
  quota?
    - this can be part of the security profile for now.
  

https://stackoverflow.com/questions/37327515/using-firebase-with-electron

- I need to REALLY grock firebase vs the realtime databse


- do a demo of firebase analytics
- 

# Discovery

 - take all the friends of users
 - look at all their documents
 - group by the friends  

# First obstacles:


This operation is not supported in the environment this application is running
on. "location.protocol" must be http, https or chrome-extension and web storage
must be enabled.  Dismiss

- two solutions
    - 1. create a fake chrome-extension://polar URI handle which servce 
         files from the .asar archive directly
         
    - 2. 


# First steps



## reading_queue app.

- Use the firebase UI to build a chrome extension to automatically sync with 
  polar to build a queue of message?
  
- This would be a good baby step app BUT it means that I have to build the 
  chrome extension which might be somewhat harder.  But at least I could get
  in the google play store and start getting more exposure.
  
- The perimissinos for this are pretty straight forward too. The only person 
  needing permissions to write is the user.
   

# Questions

- how do I prevent orphan files in google storage?

- 

- review bolt:

    https://github.com/firebase/bolt

- what is firebase remote config?

- how do we prevent individual users from going haywire and using too many 
  resources.

- how do I query for all documents for a user?

- how do I apply authorization for those documents?
    - can this auth be defeated in the client or do I have my own server 
      instance running for that
 
- If I go to cache first, will I get updates right after as the document is 
  updated?
  
- how do I do document updates? Maybe do another onDocumentLoaded event in the 
  model?  

- do FCM topics support queue'd data?

- do I really need to use FCM? I think I can just use subscribed queries as 
  basic  

- does the 100k simultaneous conenction limit count against cloudstore or just realtime database?

# Do you pay for queries or just reads when documents satisfy the query? (Cloud Firestore). 

https://www.reddit.com/r/Firebase/comments/9i8ufx/do_you_pay_for_queries_or_just_reads_when/?

# Notes:

# User authentication rules:

Something like this is what I want for user authentication

https://www.reddit.com/r/Firebase/comments/9fizoj/secure_firestore_rules_for_users_collection/

# Google cloud product decision flow chart:

https://i.stack.imgur.com/84UMm.jpg

# If I need FCM:

https://medium.com/@MatthieuLemoine/my-journey-to-bring-web-push-support-to-node-and-electron-ce70eea1c0b0



