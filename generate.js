#!/usr/bin/node

if (process.argv.length < 4) {
    console.log('Usage: generate.js [username] [password]')
    return
  }
  
const user = process.argv[2];
const pass = process.argv[3];

const sha256 = require('../haraka-necessary-helper-plugins/js-sha256');

hash = sha256(pass);
console.log(`${user} ${hash}`);
