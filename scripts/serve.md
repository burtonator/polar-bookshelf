
The commands needs to generate this cert along with a SAN (subject alternative 
name) which is required for modern chrome browsers.

Generated certs are stored in ```../polar-bookshelf-secrets/dev-certs```

We just add ca.crt to our root certs in chrome and it works.

```bash
openssl genrsa -out ca.key 2048
openssl req -new -x509 -days 3650 -key ca.key -subj "/C=CN/ST=GD/L=SZ/O=Polar/CN=Polar Root CA" -out ca.crt

openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CN/ST=GD/L=SZ/O=Polar/CN=localapp.getpolarized.io" -out server.csr
openssl x509 -req -extfile <(printf "subjectAltName=DNS:localapp.getpolarized.io") -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
```
