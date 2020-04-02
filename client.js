const io = require("socket.io-client"),
    ioClient = io.connect("http://2b612e3d.ngrok.io");

ioClient.on("seconds", (msg) => console.info(msg))
setInterval(() => {
    ioClient.emit("hello", "asd");
}, 5000)
