const 
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io"),
    redis = require('redis');

const redisServer = redis.createClient();

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
    redisServer.publish("LDRData", JSON.stringify(obj));
}
function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);

    socket.on('join', function(clientId) {
        console.log(`Client join with client id ${clientId}`);
        clientObj[socket.id] = clientId;
        socket.join(clientId);
        io.sockets.in(clientId).emit("auth", "done");
    })

    socket.on("disconnect", () => {
        //onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    })

    socket.on("LDRData", (data) => LDRDataHandler(data, clientObj[socket.id]));

    // socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}`));
    // socket.emit("welcome", `Welcome`);
}