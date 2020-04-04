const 
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io"),
    redis = require('redis');

const redisServer = redis.createClient();
const redisListener = redis.createClient();

const SERVER_PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
let clientObj = {};

// fire events
io.on("connection", onNewWebsocketConnection);

// start server
server.listen(SERVER_PORT, () => console.info(`Listening on PORT ${SERVER_PORT}`));

function LDRDataHandler(data, id) {
    let obj = {
        "clientId": id,
        "data": data,
    }
    if(id){ // only publish if id is there
        redisServer.publish("LDRData", JSON.stringify(obj));
    }
}

redisListener.on("message", (channel, msgObj) => {
    let msg = JSON.parse(msgObj);
    io.sockets.in(msg.clientId).emit("LDRAction", msg.action);
    console.log(`LDRAction published for Client ${msg.clientId} is ${msg.action}`);
})

function onNewWebsocketConnection(socket) {
    let id=0;
    console.info(`Socket ${socket.id} has connected.`);

    socket.on('join', function(clientId) {
        console.log(`Client join with client id ${clientId}`);
        clientObj[socket.id] = clientId;
        id = clientId;
        socket.join(clientId);
        io.sockets.in(clientId).emit("auth", "verified");
    })

    socket.on("disconnect", () => {
        //onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    })

    socket.on("LDRData", (data) => LDRDataHandler(data, clientObj[socket.id]));
    redisListener.subscribe("LDRAction");
    // socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}`));
    // socket.emit("welcome", `Welcome`);
}