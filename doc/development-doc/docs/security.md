# Security

Security is important for all apps, it is an exhaustive topic with a lot to cover and this page reflects that.


## Authentication

### OAuth

The only critical thing is the ID token provided, the tokens are stored in sessionStorage, which is NOT a safe location, so we need to minimize their exposure. Right after authenticating to our BE, the ID token should be DELETED.

### Session

Our approach uses stateful session based authentication, meaning the server holds an in-memory db of all the active sessions and who they correspond to. This approach is further secured by a few security mechanisms.

#### Server side

The session expires server-side, meaning that the session is always time limited.
The ssid is generated using a combination of random token (providing 32 bytes of entropy) and an uuidv4 (ensuring the ssid will be unique for all eternity)

#### Session cookie

The session cookie has the following attributes

| Name | Purpose |
|------|---------|
| MaxAge | The cookie will automatically expire after a certain durartion |
| HttpOnly | The ssid cookie cannot be accessed by client side js, resulting in protection from leaking it through XSS |
| SameSite | The SameSite is set to 'strict', securing it against CSRF attacks (There are a few exceptions however) |

#### CSRF protection

The `SameSite` attribute already handles much, but it has certain very specific exceptions, which I am not going to risk. We use signed CSRF tokens stored in sessionStorage, submitted in headers.

The CSRF token CANNOT be stored in cookie, it wouldn't serve its purpose then.

The CSRF token is generated from a random string with 32 bytes of entropy. It is also tied to an ssid, meaning it cannot be reused. Finally it is signed with a server side secret key, using HMAC(sha256), meaning it cannot be manipulated or artificially crafted.

Note: The sessionStorage is not a safe storage, but we don't necessarily mind exposing CSRF tokens, because they can only be used for a single ssid (the attacker doesn't know which one though + the ssid cannot be exposed in the same way the CSRF token can). In summary the amount of vulnerabilities, which would have to arise for this to be exploitable is unlikely.
