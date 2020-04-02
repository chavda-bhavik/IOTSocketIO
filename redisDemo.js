var redis = require('redis');
// const subscriber = redis.createClient();
// const publisher = redis.createClient();

// let msgCount = 0;
// subscriber.on("subscribe", (channel, count) => {
//     publisher.publish("a channel", "a message");
//     publisher.publish("a channel", "another message");
// })

// subscriber.on("message", (channel, message) => {
//     msgCount++;
//     console.log("Subscriber received message on channel '"+channel+"': "+message);
//     if(msgCount === 2) {
//         subscriber.unsubscribe();
//         subscriber.quit();
//         publisher.quit();
//     }
// })

// subscriber.subscribe("a channel");

var client = redis.createClient();
client.on('connect', () => {
    client.lrange("mylist", 0, 2, (err, res) => {
        console.log(res);
    })
    client.LLEN("mylist", (err,res) => {
        console.log(`Length of mylist is ${res}`);
    })
    // console.log("Redis Client Connected");
    // client.set('test', 'value', redis.print);
    // client.get('test', (err, result) => {
    //     if(err) {
    //         console.log(err);
    //         throw err;
    //     }
    //     console.log(`Get Result for test:- ${result}`);
    // })
    // client.hmset("hm", ["foo", "bar"], (err,res) => {
    //     if(!err)
    //         console.log(res);
    // })
    // client.hmget("hm", (err, res) => {
    //     if(!err) console.log(res);
    // })
    // client.hmset("key", "foo", "bar", "hello", "world");
    // client.hgetall("key", (err, value) => {
    //     console.log(value);  // key will be "key" and value = {foo:"bar", hello:"world"}
    // })
    
})
client.on('error', (err) => {
    console.log('Something went wrong '+err);
})

