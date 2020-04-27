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
var moved = false;
twofingers = false;

function doubleTap(event) {
    if (event.touches.length == 2) return;
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
    moved = false;
    doubleTap(e);
}

function singleFinger(e) {
    var x = e.touches[0].clientX,
        y = e.touches[0].clientY;
    var dx = 4 * (x - sx),
        dy = 4 * (y - sy);
    ax = (tx + dx);
    ay = (ty + dy);
    socket.emit("position", { ax, ay });
}

function onCancel(e) {
    alert("cancelled")
}

function doubleFinger(e) {
    twofingers = true;
    var x = e.touches[1].clientX,
        y = e.touches[1].clientY;
    var dx = (x - sx) / 10,
        dy = (y - sy) / 10;
    socket.emit("scroll", { dx, dy });

}

function onMove(e) {
    moved = true;
    if (e.touches.length == 1) {
        if (twofingers) {
            twofingers = false;
        }
        singleFinger(e);
    }
    if (e.touches.length == 2)
        doubleFinger(e);
}

function onStop(e) {
    tx = ax;
    ty = ay;
    var touch_end = new Date().getTime();
    if (touch_end - touch_start < 300 && moved == false) socket.emit("click");
    socket.emit("mouse_toggle", "up");
}