const 
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io")

const SERVER_PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// fire events
io.on("connection", onNewWebsocketConnection);

// start server
server.listen(SERVER_PORT, () => console.info(`Listening on PORT ${SERVER_PORT}`));

// setInterval(() => {
//     for (const [client, sequenceNumber] of onlineClients.entries()) {
//         client.emit("seq-num", sequenceNumber);
//         onlineClients.set(client, sequenceNumber + 1);
//     }
// }, 1000);

// let secondsSinceServerStarted = 0;
// setInterval( () => {
//     secondsSinceServerStarted++;
//     io.emit("seconds", secondsSinceServerStarted);
// }, 1000);


function generateRandomNumber() {
    return (Math.floor(Math.random() * 1000).toString());
}

function LDRDataHandler(socket) {
    console.log(`LDRData come is `+socket);
}
function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);

    socket.on('join', function(data) {
        console.log(`join with data ${data}`);
        //socket.join(data)
        socket.join(data);
        io.sockets.in(data).emit("auth", "done");
    })

    socket.on("disconnect", () => {
        //onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    })

    socket.on("LDRData", LDRDataHandler);

    // socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}`));
    // socket.emit("welcome", `Welcome`);
}