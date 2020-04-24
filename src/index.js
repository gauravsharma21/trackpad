const express = require('express');
const robot = require('robotjs');
const path = require('path');
const events = require('./events');

const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const PORT = 3000 || process.env.PORT;
const publicpath = path.join(__dirname, "../public")

app.use(express.static(publicpath))

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("position", (pos) => {
        events.move_mouse(pos)
    })

    socket.on("click", () => {
        events.click_mouse();
    })

    socket.on("mouse_toggle", (val) => {
        console.log(val);
        events.toggle_mouse(val);
    })

    socket.on("disconnect", () => {
        console.log("disconnected")
    })
})

http.listen(PORT, () => {
    console.log("Server is up on " + PORT);
})