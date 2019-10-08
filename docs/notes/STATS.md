# Overview

## Stats backend

We should build a 'generic' stats backend similar to the Datastore. We could
call this a MetricStore and store them in both Firebase and on disk. The 
MetricStore when local, could just be a log structure append-only line oriented
JSON store as a TSD. 

Simple records like, time, name, value.

The big downside to this is that we might require some sort of index. It might be 
valuable to keep the metrics we track to less than say 2 dozen metrics this way
the local machine isn't hammered with metrics.   

## JSON structure

I could use this underlying structure (log structured append-only JSON) for other
projects like a database of notes with an in-memory index and data backed on 
disk.

I could also use this as our datastore in the future with the idea of the event
stream with checkpointing.   

# Core Polar Stats to Track

- the size (bytes + nr docs) of your repo over time
    - by flagged
    - by archived
    
- the changes to pagemarks so that we can show reading history over time per
  document 
    - maybe globally to begin with...
    
- number of annotaitons and flashcards over time?

    -
    
- stats about number of days read to encourage people to keep working...         
