const client = require('./client');

async function init(){
    // client.set("msg:6","hey i am nodejs");
    // client.expire("msg:6",10); //after 10sec
    // also we can implement rate-limiting
    const result = await client.get('msg:6');
    console.log("Result->",result);
}
init();