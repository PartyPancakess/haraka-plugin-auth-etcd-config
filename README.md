[![NPM][npm-img]][npm-url]

# haraka-plugin-auth-etcd-config

This plugin is based on auth-enc-file (https://github.com/AuspeXeu/haraka-plugin-auth-enc-file).
It uses SHA256 for user passwords.


## Configuration
Running etcd server must have key(s) in the config/mta/domains/\<domain>/user format.
The users defined under a domain is only allowed to send mails from that domain.

### Example etcd Configuration

For every user:

\<username> \<space> \<sha256 digest of password1> \<CRLF>

```
etcdctl put config/mta/domains/domain.com/user "user d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1
user2 d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1
"
```
In the above example, user and user2 have the passwords "pass" (converted) and are under the domain "domain.com." These 2 users will only be able to send mails from domain.com.
Such as:
```
swaks -s localhost:587 -f sender@domain.com -t goto@gmail.com -au user -ap pass --tls
```
Above command will work, while the below one will not:
```
swaks -s localhost:587 -f sender@test.com -t goto@gmail.com -au user -ap pass --tls
```


### Generating Password

The plugin has a generate script that will generate the etcd config input of a given username and password.

Usage:
```
node ./generate.js username1 pass

Returns:

username1 d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1
```




<!-- leave these buried at the bottom of the document -->
[npm-img]: https://nodei.co/npm/haraka-plugin-auth-etcd-config.png
[npm-url]: https://www.npmjs.com/package/haraka-plugin-auth-etcd-config
