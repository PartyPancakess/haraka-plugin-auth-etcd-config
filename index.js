// Config of this plugin (this.cfg) consists of every user and their password (user=pass)
// domain checks are done manually, later, by mail(mail_from) hook.


const sha256crypt = require('../haraka-necessary-helper-plugins/sha256crypt');

const { Etcd3 } = require('../haraka-necessary-helper-plugins/etcd3');
const etcdClient = new Etcd3();

const empty_cfg = {
  users: {
  }
};

var domain_list;

exports.hook_capabilities = function (next, connection) {
  // Don't offer AUTH capabilities by default unless session is encrypted
  if (connection.tls.enabled) {
    const methods = ['PLAIN', 'LOGIN'];
    connection.capabilities.push(`AUTH ${methods.join(' ')}`);
    connection.notes.allowed_auth_methods = methods;
  }
  next();
}

exports.register = function () {
  this.inherits('auth/auth_base');
 
  this.cfg = empty_cfg;
  this.load_config();
  this.register_hook('mail', 'domain_check');
}


function load_users_config(domains) {
  const plugin = this;
  
  this.cfg = empty_cfg;
  for (var key in domains) {
    var users = domains[key].split('\n');
    
    users.forEach(function(user) {
      if (user) {
        plugin.cfg.users[user.split(" ")[0]] = user.split(" ")[1];
      }
    });
  }
}

exports.load_config = function () {
  etcdClient.getAll().prefix('config/mta/domains/').strings()
  .then(domains => {
    if (domains) {
      domain_list = domains;
      load_users_config(domains);
    }
    else console.log("Something went wrong while reading config/mta/domains/... from Etcd");
  });
  
  etcdClient.watch()
  .prefix('config/mta/domains/')
  .create()
  .then(watcher => {
    watcher
      .on('disconnected', () => console.log('disconnected...'))
      .on('connected', () => console.log('successfully reconnected!'))
      .on('put', res => {
        const changed_key = res.key.toString();

        domain_list[changed_key] = res.value.toString();
        this.cfg.users = {};
        load_users_config(domain_list);
      });
  });
}


exports.domain_check = function (next, connection, params) {
  if (connection.relaying) {    
    const plugin = this;
    const txn = connection.transaction;
    if (!txn) { return; }

    const email = params[0].address();
    if (!email) {
        txn.results.add(plugin, {skip: 'mail_from.null', emit: true});
        return next();
    }

    var domain = params[0].host.toLowerCase();
    var domain_config = "config/mta/domains/" + domain;

    if(connection.notes) {
      if(domain_list[domain_config]) {
        var users = domain_list[domain_config].split('\n');

        var included = false;
        
        users.forEach(function(user) {
          if(user) {
            const saved_user = user.substr(0, user.indexOf(' '));
            if (saved_user === connection.notes.get('auth.user'))
              included = true;
          }
        });

        if (!included) {
          return next(DENYSOFT, "Authentication failed! This user does not have permission for this domain.");
        }
      }
    }
    else
      console.log("Something is wrong with the 'Connection' property of Haraka. Check 'haraka-plugin-auth-etcd-config' plugin.");

  }
  next();
}


exports.check_plain_passwd = function (connection, user, passwd, cb) {
  if(connection.notes)
    connection.notes.set('auth.user', user);
  else
    console.log("Something is wrong with the 'Connection' property of Haraka. Check 'haraka-plugin-auth-etcd-config' plugin.");

  if (this.cfg.users[user]) {
    return cb(sha256crypt.verify(passwd, this.cfg.users[user]));
  }
  return cb(false);
}
