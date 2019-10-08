Right now we should just make our express APP use HTTPS and then trust the key 
within electron.

openssl genrsa -out polar-ssl.key 2048
openssl req -new -key polar-ssl.key -out polar-ssl.csr    
openssl x509 -req -days 3650 -in polar-ssl.csr -signkey polar-ssl.key -out polar-ssl.crt



OK.. now we have a MAJOR problem.. since we're using this hacked session code
interceptor we can NOT catch teh certificate error event....  there is simply 
no way to handle this ithout it being super ugly I think...

so the main problems are:

    - I can't build my own custom scheme as many apps require https and a "real" URL 
      (app:) won't work 
    
    - I can't use a custom parent request loader as I can't get a handle on it... 
    
    - 
         
