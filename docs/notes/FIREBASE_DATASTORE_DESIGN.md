
# TODO

  - how do I determine if a local machine is out of sync with firestore?
    - Just put it in CLOUD mode. We could have two modes. LOCAL and CLOUD.  
      When in CLOUD mode it just operates as if it's in sync with the cloud.
      
    - The only time we have to deal with MERGE is when we're converting from 
      LOCAL to CLOUD and have to determine the source of truth.
      
        If the CLOUD is not empty then we have to handle the initial sync
          CLOUD_TO_LOCAL
          LOCAL_TO_CLOUD
          MERGE
          
    - 
    


# NOTES


- new strategy for firestore.

    - the local repo is the source of truth
    - existence operations by default come from the local store
    - operations complete on BOTH the firestore and local repos by default and 
      we wait until we get the cache ack back from the local firestore... 
    - technically , I need to make it so that firestore write go first, wait until 
      they are committed locally, and then  


    - add an optional listener param to all datastore methods to determine when 
      the write was comopleted locally or remote but I don't konw how to deal
      with the local datastore since there is no remote.  What do we call it?
      
    - I need a param for each method for the 'level' of the write... 
    
    - then the writes should work like this:
    
        - all writes go into firebase as 'local'
        - when that is complete write to local
        - TODO: we're going to get snapshot operations from firebase for commits done 
          on the local machine and commits done on different machines.  We need to 
          avoid re-executing events we've already applied. 
                 
            - we need some way to determine if this operation has ALREADY been applied  

        - TODO: we might not be the only window locally.. we need a way to make 
          sure transactions aren't applied twice.
            - I don't need this now because I only allow one document repository... 
              so I can punt on this issue!
              
        - file sync needs to be done by writing a files/{backend}/path entry 
          for each file and then we sync and pull them out of the cloud storage               
          
        - fuck this is actually a hard problem!
         
    - if we can make the query execute from the CACHE version only, then on startup 
      we can see which versions we ALREADY ahve, then anything NEW would be a 
      differential.. by definition and then we woul djust sync the new stuff.
      
    - we can query local first. we can do this.. the way it work is that I need
      to first query a query LOCAL... then I can pull down this data ... we have to 
      call get() on the query not onSnapshot() ... and tell the get() to only 
      execute locally.
      
    - the big problem I have now, regardless of any of this is that I now have
      an issue where if the client is disconnected, I"m not sure which way to 
      sync.  
      
        - just do this migration ONCE ...
        - make sure its' not an existing account
        - if existing data si there , purge it... 
        
        - what about MERGE? ... ALWAYS do merge by default. 
        
        - there are three operations, merge, remote to local and local to remote. 
                 
    - once we're in the firebase datastore and operating from the local cache 
      with sync we shoudl be ok... 



# TODO:

    - if there is a race on startup with the existing snapshots docs and whether
      we have ot check fi they've been fetched locally.. it's possible that a
      remote doc is pulled down, we get a notice that it's
 

