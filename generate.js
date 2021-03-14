#!/usr/bin/node

if (process.argv.length < 4) {
    console.log('Usage: generate.js [username] [password]')
    return
  }
  
const user = process.argv[2];
const pass = process.argv[3];

const sha256crypt = require('../haraka-necessary-helper-plugins/sha256crypt');

hash = sha256crypt.hash(pass);
console.log(`${user} ${hash}`);
