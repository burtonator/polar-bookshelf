# Overview 

This is a brief description of how the datastored work in Polar circa 10-15-2018
to help highlight any concerns about security, privacy, and data integrity
our users might have - especially with the cloud options.

# Simple cloud syunc - Dropbox / Git 

It's possible to sync the .polar directory directly with Dropbox.  It will work 
with git as well but requires you to remember to manually commit and push your 
repository.

# Simple cloud sync has a limited feature set 

However this provides a limited feature set.  Firebase allows me to:

- provide a social platform for sharing content across users
    - discover other docs from your friends and anyone sharing them publicly
    - comment publicly on books
    - share flashcards across books
    - improve on annotations 
    - discovery popular highlights, etc.
    
- sharing URLs from your devices (phone, main browser) and sharing them with 
  Polar. 

- realtime sync across devices of all data.  

- in-app selective sync
   - selectively keep metadata on the server after you've archived it - avoiding
     bloating your local disk
     
   - moving certain tags to the repo, or keeping certain tags locally forever. 

# Cloud concerns

However, the cloud has its own concerns:

- private data needs to be private.
- encryption for private data would be desirable.
- other providers other than Google, AWS, etc would be nice

# EncryptedDatastore

We're going to impelment an encrypted datastore which can be combined with other
datastores.  Any data which has private visibility will be encrypted before being
send to the server.  The key will be kept local. If you lose the key you lose 
the data.

We're also going to offer to keep a copy of the key on the server.  But this means
you need to pick a VERY secure passphrase for your key as at this point it's 
easy to brute force if you have the key.
 
# FirebaseDatastore

The Filebase datastore provide the infrastructure to store content info Firebase

# TODO

- explain this further. 
