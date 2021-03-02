[![NPM][npm-img]][npm-url]

# haraka-plugin-auth-etcd-config

This plugin is based on auth-enc-file (https://github.com/AuspeXeu/haraka-plugin-auth-enc-file).
It uses SHA256CRYPT for user passwords.


## Configuration
Running etcd server must have key(s) in the config/mta/domains/\<domain> format.
The users defined under a domain is only allowed to send mails from that domain.

### Example etcd Configuration

For every user:

\<username> = \<sha256 digest of password1> \<CRLF>

```
etcdctl put config/mta/domains/domain.com "user=PtjxQL5GUfVgaUANlOrmXA4w7HPvxFfn2wfApOLWeZ2
user2=PtjxQL5GUfVgaUANlOrmXA4w7HPvxFfn2wfApOLWeZ2
"
```
In the above example, user and user2 have the passwords "pass" (converted) and are under the domain "domain.com." These 2 users will only be able to send mails from domain.com.
Such as:
```
swaks -s localhost:587 -f sender@domain.com -t goto@gmail.com -au test -ap pass --tls
```
Above command will work, while the below one will not:
```
swaks -s localhost:587 -f sender@test.com -t goto@gmail.com -au test -ap pass --tls
```


### Generating Password

The plugin has a generate script that will generate the etcd config input of a given username and password.

Usage:
```
node ./generate.js username1 pass

Returns:

username1=PtjxQL5GUfVgaUANlOrmXA4w7HPvxFfn2wfApOLWeZ2
```




<!-- leave these buried at the bottom of the document -->
[ci-img]: https://github.com/PartyPancakess/haraka-plugin-auth-etcd-config/workflows/Plugin%20Tests/badge.svg
[ci-url]: https://github.com/PartyPancakess/haraka-plugin-auth-etcd-config/actions?query=workflow%3A%22Plugin+Tests%22
[ci-win-img]: https://github.com/PartyPancakess/haraka-plugin-auth-etcd-config/workflows/Plugin%20Tests%20-%20Windows/badge.svg
[ci-win-url]: https://github.com/PartyPancakess/haraka-plugin-auth-etcd-config/actions?query=workflow%3A%22Plugin+Tests+-+Windows%22
[clim-img]: https://codeclimate.com/github/PartyPancakess/haraka-plugin-auth-etcd-config/badges/gpa.svg
[clim-url]: https://codeclimate.com/github/PartyPancakess/haraka-plugin-auth-etcd-config
[npm-img]: https://nodei.co/npm/haraka-plugin-auth-etcd-config.png
[npm-url]: https://www.npmjs.com/package/haraka-plugin-auth-etcd-config
