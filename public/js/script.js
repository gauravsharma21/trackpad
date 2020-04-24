const socket = io();

var x = 0,
    y = 0,
    tx = 0,
    ty = 0,
    sx = 0,
    sy = 0,
    ax = 0,
    ay = 0;

var tapedTwice = false;
var touch_start = new Date().getTime();

function doubleTap(event) {
    if (!tapedTwice) {
        tapedTwice = true;
        setTimeout(function() { tapedTwice = false; }, 300);
        return false;
    }
    event.preventDefault();
    socket.emit("mouse_toggle", "down");
}

function onStart(e) {
    touch_start = new Date().getTime();
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
    doubleTap(e);
}

function coordinate(e) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    var dx = 4 * (x - sx),
        dy = 4 * (y - sy);
    var wheight = screen.height;
    var wwidth = screen.width;
    ax = (tx + dx);
    ay = (ty + dy);
    socket.emit("position", { ax, ay, wheight, wwidth });
}

function onStop(e) {
    tx = ax;
    ty = ay;
    var touch_end = new Date().getTime();
    if (touch_end - touch_start < 300) socket.emit("click");
    socket.emit("mouse_toggle", "up");
}