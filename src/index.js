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

    socket.on("move", (pos) => {
        events.move_mouse(pos)
    })

    socket.on("click", (val) => {
        // console.log(val);
        events.click_mouse(val);
    })

    socket.on("mouse_toggle", (val) => {
        events.toggle_mouse(val);
        // console.log(val);
    })

    socket.on("scroll", (pos) => {
        events.scroll_mouse(pos);
    })

    socket.on("disconnect", () => {
        console.log("disconnected")
    })

})

http.listen(PORT, () => {
    console.log("Server is up on " + PORT);
})