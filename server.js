const 
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io")

const SERVER_PORT = 3000;

let nextVisitorNumber = 1;
let onlineClients = new Map();

function generateRandomNumber() {
    return (Math.floor(Math.random() * 1000).toString());
}

function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);
    onlineClients.set(socket, 1);

    socket.on("disconnect", () => {
        onlineClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    })

    socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}`));
    socket.emit("welcome", `Welcome! You are visitor number ${nextVisitorNumber++}`);
}

function startServer() {
    const app = express();
    const server = http.createServer(app);
    const io = socketio(server);

    app.get("/random", (req,res) => res.send(generateRandomNumber()));

    app.use(express.static("public"));

    io.on("connection", onNewWebsocketConnection);

    server.listen(SERVER_PORT, () => console.info(`Listening on PORT ${SERVER_PORT}`));

    // setInterval(() => {
    //     for (const [client, sequenceNumber] of onlineClients.entries()) {
    //         client.emit("seq-num", sequenceNumber);
    //         onlineClients.set(client, sequenceNumber + 1);
    //     }
    // }, 1000);

    let secondsSinceServerStarted = 0;
    setInterval( () => {
        secondsSinceServerStarted++;
        io.emit("seconds", secondsSinceServerStarted);
    }, 1000);
}

startServer();