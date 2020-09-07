const express = require('express');
const path = require('path');
const events = require('./events');

const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const PORT = 3000 || process.env.PORT;
const publicpath = path.join(__dirname, "../public")

app.use(express.static(publicpath))
app.use(express.json());

app.get('/size', (req, res) => {
    res.send(events.getScreenSize());
})

var x, y;

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("init", () => {
        var obj = events.mouse_position();
        x = obj.x;
        y = obj.y;
    })

    socket.on("type", (val) => {
        events.key_press(val);
    })

    socket.on("move", (pos) => {
        events.move_mouse({...pos, x, y });
    })

    socket.on("click", (val) => {
        events.click_mouse(val);
    })

    socket.on("mouse_toggle", (val) => {
        events.toggle_mouse(val);
    })

    socket.on("key_toggle", (val, down) => {
        events.key_toggle(val, down);
    })

    socket.on("disconnect", () => {
        console.log("disconnected")
    })

})

http.listen(PORT, () => {
    console.log("Server is up on " + PORT);
})