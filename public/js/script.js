const socket = io();

var ax = 0,
    ay = 0,
    tx = 0,
    ty = 0,
    distance_x = 0,
    distance_y = 0;
var tapedTwice = false;
var touch_start = new Date().getTime();
var moved = false;
twofingers = false;
var touches = [];

function distance(source, destination) {
    return Math.abs(source - destination);
}

function doubleTap(event) {
    if (event.touches.length == 2) return;
    if (!tapedTwice) {
        tapedTwice = true;
        setTimeout(function() { tapedTwice = false; }, 300);
        return false;
    }
    socket.emit("mouse_toggle", "down");
}

function onStart(e) {
    touch_start = new Date().getTime();
    for (var i = 0; i < e.touches.length; i++) {
        touches.push(e.touches[i]);
    }
    moved = false;
    distance_x = 0;
    distance_y = 0;
    doubleTap(e);
}

function singleFinger(e) {
    var x = e.touches[0].clientX,
        y = e.touches[0].clientY;
    var dx = 4 * (x - touches[0].clientX),
        dy = 4 * (y - touches[0].clientY);
    ax = (tx + dx);
    ay = (ty + dy);
    socket.emit("position", { ax, ay });
}

function onCancel(e) {
    alert("cancelled")
}

function doubleFinger(e) {
    twofingers = true;
    var changedTouches = e.changedTouches;
    for (var i = 0; i < changedTouches.length; i++) {
        var x = e.touches[i].clientX,
            y = e.touches[i].clientY;
        var init;
        for (var i = 0; i < touches.length; i++) {
            if (touches[i].identifier == i)
                init = touches[i];
        }
        if (init == undefined) return;
        if (distance(init.clientX, x) > distance_x) {
            distance_x = distance(init.clientX, x);
        } else {
            init.clientX = x;
            distance_x = 0;
        }
        if (distance(init.clientY, y) > distance_y) {
            distance_y = distance(init.clientY, y);
        } else {
            init.clientY = y;
            distance_y = 0;
        }
        var dx = (x - init.clientX) / 10,
            dy = (y - init.clientY) / 10;
        socket.emit("scroll", JSON.stringify(changedTouches));
    }
}

function onMove(e) {
    e.preventDefault();
    moved = true;
    if (e.touches.length == 1) {
        if (twofingers) {
            twofingers = false;
        }
        singleFinger(e);
    }
    if (e.touches.length == 2) {
        doubleFinger(e);
    }
}

function onStop(e) {
    tx = ax;
    ty = ay;
    var touch_end = new Date().getTime();
    if (touch_end - touch_start < 300 && moved == false) socket.emit("click");
    socket.emit("mouse_toggle", "up");
    touches = [];
}