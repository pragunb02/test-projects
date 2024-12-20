const client = require('./client');

async function init() {
    // await client.lpush("messages",1);
    // await client.lpush("messages",2);
    // await client.lpush("messages",3);
    // await client.lpush("messages",4);
    // const result=await client.lpop("messages");
    const result=await client.blpop("messages",10);
    // const stramresult=await client.zadd("temp",1);  /// streams
    console.log(result);
}

init();