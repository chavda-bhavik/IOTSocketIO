var redis = require('redis');
const subscriber = redis.createClient();
const publisher = redis.createClient();
var client = redis.createClient();

// const publisher = redis.createClient();
// subscriber.on("subscribe", (channel, count) => {
//     let obj = {
//         "clientId": "asdf23",
//         "data": 15,
//     }
//     publisher.publish("LDRData", JSON.stringify(obj));
// })

const normalLDR = 20;
const maxDataToStore = 20;

const processData = (data, clientID) => {
    return new Promise( (resolve,reject) => {
        let len = data.length;
        
        console.log(data[len-1], parseInt(data[len-2]), parseInt(data[len-3]));
        if(parseInt(data[len-1]) < normalLDR && parseInt(data[len-2]) < normalLDR && parseInt(data[len-3]) < normalLDR) {
            if(len > maxDataToStore) {
                client.LTRIM("LDR-"+clientID, 0, 16);
                //client.DEL();
            }
            resolve();
        }
        reject();
    })
}

subscriber.on("message", (channel, msgObj) => {

    let data = JSON.parse(msgObj); // clientId, data
    
    // setting ldr data in the temporary variable "value"
    client.set("temp", data.data);

    // getting ldr data stored in temporary variable "value"
    client.get("temp", (err, res) => {
        // pushing ldr data with clientid in the memory array of client
        client.rpush("LDR-"+data.clientId, res);
    })

    // fetching and processing on data
    client.lrange("LDR-"+data.clientId, 0, -1, (err, res) => {
        if(err) console.log(err.message);
        else { 
            processData(res, data.clientId)
                .then( () => {
                    publisher.publish("LDRAction", JSON.stringify({ clientId: data.clientId, action: "HIGH"}));
                    console.log("Published High");
                })
                .catch( () => {
                    publisher.publish("LDRAction", JSON.stringify({ clientId: data.clientId, action: "LOW"}));
                    console.log("Published LOW");
                });
        }
    })
})

subscriber.subscribe("LDRData");
subscriber.on('error', (err) => {
    console.log('Something went wrong '+err);
})
