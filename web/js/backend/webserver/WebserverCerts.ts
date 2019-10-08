/**
 * Raw certs for electron. Note that the private key here is distributed
 * publicly but is only vulnerable to attacks on localhost unless DNS is
 * hijacked. We're going to try to migrate to a new system that either:
 *
 * - Generates keys on startup which are ephemeral between instances.  This
 *   would require an attacker to have access to the Electron in-process
 *   memory which would not be practical.  Note that this is ALREADY better
 *   than serving over HTTP which we're currently doing.
 *
 * - Use a Electron specific system where we fake a webserver by using protocol
 *   handlers but right now this isn't insanely easy and I want to figure
 *   out a better way to handle this long term.
 *
 * NOTE: we're not actually using this at the moment and might back it out in
 * the future.
 *
 */
export class WebserverCerts {

    /**
     * The raw CERT data. Note that this should last ten years.
     */
    public static CERT: string =
`-----BEGIN CERTIFICATE-----
MIIDXjCCAkagAwIBAgIUBIXlY4gFwF8UZtzQiBwJ236HpVMwDQYJKoZIhvcNAQEL
BQAwTzELMAkGA1UEBhMCQ04xCzAJBgNVBAgMAkdEMQswCQYDVQQHDAJTWjEOMAwG
A1UECgwFUG9sYXIxFjAUBgNVBAMMDVBvbGFyIFJvb3QgQ0EwHhcNMTkwNzE4MjMx
MzExWhcNMjkwNzE1MjMxMzExWjBaMQswCQYDVQQGEwJDTjELMAkGA1UECAwCR0Qx
CzAJBgNVBAcMAlNaMQ4wDAYDVQQKDAVQb2xhcjEhMB8GA1UEAwwYbG9jYWxhcHAu
Z2V0cG9sYXJpemVkLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
3ecJ9gGGL5xK6u41l1BxMMHu/936h2Z/Imj8SN4BLvY4uUNSsoVt1vWDjiLHCR7A
H1zQtjUkOyBawR3zhlasX5+T8FUuf+7ptjl9Zq6z1k5UgIHka3Js9IpLJR/tPJUr
y0mlgKa2r6HR/d+pP+SzXA1L1NYRIGR20k8oJIYeZH1maIl2bxqB+U+Ay2jxPpcr
4XVRCmWVO7CVZY3dejI18jlYyNstxJeGQiBA8pvMUzcfh0SdN4eb/eayvcGIYstR
PGbpxGIdnzvscaXfY9CKTHsQhs8VviVHPo6N9G3drWZW4bjIV8wYHtwWrbuTcvt6
6M3mxUWfHerKucC3pQ8mLQIDAQABoycwJTAjBgNVHREEHDAaghhsb2NhbGFwcC5n
ZXRwb2xhcml6ZWQuaW8wDQYJKoZIhvcNAQELBQADggEBADQUZLXT7lFECLdP+h/y
+wQuoscWsG//sTIkblWmaMkqzknJQkA5bPJPWvytbILGL/bGZ4Y7N+IYPnfFP4qR
DOM/THn6OmxyfmICD5iBM0e6GmdDhnBpDM/n+IUryZZTC/HhNmIu3QlKoTKxgPBo
HfWCx/HkvuQ4xCF8mH74K9g+rTbWDRbA/N8dwcuSSpXPW5pIkgirjE/zT9AT7ZOF
43yNmEihSc7289JsO/jEOQuT5oazU3FtVnRqB5p5otN666UiEzu0IBDo/y832qs6
McLDxoHS1fkvHpB+7OMyU89S2ZyN6g6aFa9w/a5novhzXE8wqydnNEczT8u0dm2A
FHY=
-----END CERTIFICATE-----`;

    public static KEY: string =
`-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDd5wn2AYYvnErq
7jWXUHEwwe7/3fqHZn8iaPxI3gEu9ji5Q1KyhW3W9YOOIscJHsAfXNC2NSQ7IFrB
HfOGVqxfn5PwVS5/7um2OX1mrrPWTlSAgeRrcmz0ikslH+08lSvLSaWApravodH9
36k/5LNcDUvU1hEgZHbSTygkhh5kfWZoiXZvGoH5T4DLaPE+lyvhdVEKZZU7sJVl
jd16MjXyOVjI2y3El4ZCIEDym8xTNx+HRJ03h5v95rK9wYhiy1E8ZunEYh2fO+xx
pd9j0IpMexCGzxW+JUc+jo30bd2tZlbhuMhXzBge3Batu5Ny+3rozebFRZ8d6sq5
wLelDyYtAgMBAAECggEAEEsChDmgbKaBKbbL4Ixbg0T6E3dtCbwQ4anrvD3wwE37
5D55N/psEjh8rFcJXjYPzT23ZWmJe33oq/1TAC4lAfBpoF/gxiv4pRSbjIqPUdD2
i2j+KJWCQoJU+ijZ9nTNfmOt70BOcZ7kGEvv1W0pbjzbsIj3QPWfc9m0DNp8KMyZ
U+1EXuirHvkKraTdwSpVxpD4rB+iVMc5iDEZBX7pq2OXYCvEEY0T1oKBBuLK9ZVJ
mSk5FERc+7aY18F/Qfo978KPAEqUmkHi379ggCI4CM3wZdguHZoa3JACH/6f1La4
pZnN8K4MaJ0bnNhP5BJ6G3MXvKCSynuatADdD2fK0QKBgQDwIlhOjKsZ6kNDtFMA
IySV6b5H7eN4X2hiTU22u5S8K9keliBmEckIDgCgTk8Y3vBz2jSis1ApXklBuu3s
40mFOz/Va6TRiLRrUS1bpld6WKVy7/u7KXD2cKbiwmKbTS/XxRnYZUn17FCKdEJi
ell2+7uj/WkNgcmrGkrE7ZRDCwKBgQDskFJWRA5C1m8aeTYbWLrIJAtYbZG6vLRk
fuTLhxPWbw9ttW9vh1WMRTxhXai+7OvZFdLJETolzFNbZJc5bLNiWTnfNR4TAz6q
iUMWmV1joqbyuKFY/xfhyvxhWm+19lCZROw1ZrLOoz/HR4W1GbQzRzw526K3wGQX
xSZNyAh+pwKBgQDVcAGDl96BA0rUQ9Q+W/4pzX/WmShFFrBGJ6W6lNInyuWKHTAg
6RABO8jss430cjvRDZMZRj4q9uYwKUFO+9qeNEKRpMLzhwmuFZI2UwyP73jnR009
VyFTul9rUBGrLhknNMa7I5RwpKIV3i4fL9aTPj7TDOuyGLkyfwUUMoNEbwKBgFdX
jd7l77IDxC+tEyoTn5rnm/zBL64XoC7+nvD6ZXuls7eY5pTyDcblhT6ZuwULKqUT
JqkwIBz2jMxQnnkIRk8IjJJ55Sm15/xFA60jYNS5qBQz0Pav8JxgOsCjCF3RnL6K
MQAic+BRa+ni4V4VKHBKW9Us364ibZJNKzBKq8A/AoGAD+Fltpn9aTSkqF6b6py7
RLsw/3LJ7ZvvfQAgt1jLo6E48vsIt92o9ZRWDB5kCaqRWOA0WroWw1Kalrt0fE8O
LFZ12cmM5jYdo+jr8W2euoWToWNIv7UgGp7DA/Bi4NRly8pKkZcdxYFnAnWOTExz
rMeAK5h8AKWL2YbaGKCoPtw=
-----END PRIVATE KEY-----`;

}
