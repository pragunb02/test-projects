const { Redis } = require('ioredis');

const client = new Redis();
// by default it hit the redis server at port 6379  

module.exports = client;
 