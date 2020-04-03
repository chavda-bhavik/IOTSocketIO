var redis = require('redis');
const subscriber = redis.createClient();
var client = redis.createClient();

// const publisher = redis.createClient();
// subscriber.on("subscribe", (channel, count) => {
//     let obj = {
//         "clientId": "asdf23",
//         "data": 15,
//     }
//     publisher.publish("LDRData", JSON.stringify(obj));
// })

subscriber.on("message", (channel, msgObj) => {

    let data = JSON.parse(msgObj); // clientId, data
    
    client.set("value", data.data);
    client.get("value", (err, res) => {
        console.log(res);
        client.rpush("LDR-"+data.clientId, res);
    })
    client.lrange("LDR-"+data.clientId, 0, -1, (err, res) => {
        if(err) console.log(err.message);
        else { 
            console.log(`LDR Data for ${data.clientId}`)
            console.log(res);
        }
    })

    // client.SADD("LDR:"+data.clientId, +data.data);
    // client.smembers("LDR:"+data.clientId, (err, res) => {
    //     if(err) console.log(err.message);
    //     console.log(res);
    // })
    // if(msgCount === 2) {
    //     subscriber.unsubscribe();
    //     subscriber.quit();
    //     publisher.quit();
    // }
})

subscriber.subscribe("LDRData");
subscriber.on('error', (err) => {
    console.log('Something went wrong '+err);
})
