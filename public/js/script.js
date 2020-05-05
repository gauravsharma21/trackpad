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

function findTouchById(touches, id) {
    for (var i = 0; i < touches.length; i++) {
        if (touches[i].id == id) return i;
    }
    return undefined;
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
    // for (var i = 0; i < touches.length; i++) console.log(touches[i]);
    touch_start = new Date().getTime();
    for (var i = 0; i < e.touches.length; i++) {
        touches.push({ id: e.touches[i].identifier, x: e.touches[i].clientX, y: e.touches[i].clientY });
    }
    if (e.touches.length == 2) twofingers = true;
    else twofingers = false;
    moved = false;
    distance_x = 0;
    distance_y = 0;
    doubleTap(e);
}

function singleFinger(e) {
    var x = e.touches[0].clientX,
        y = e.touches[0].clientY;
    var id = findTouchById(touches, e.touches[0].identifier);
    var dx = 4 * (x - touches[id].x),
        dy = 4 * (y - touches[id].y);
    ax = (tx + dx);
    ay = (ty + dy);
    socket.emit("position", { ax, ay });
}

function onCancel(e) {
    alert("cancelled")
}

function scroll(idx, e, changedTouches) {
    var id = changedTouches[idx].identifier;
    id = findTouchById(touches, id);
    var x = changedTouches[idx].clientX,
        y = changedTouches[idx].clientY;
    if (distance(touches[id].x, x) > distance_x) {
        distance_x = distance(touches[id].x, x);
    } else {
        touches[id].x = x;
        distance_x = 0;
    }
    if (distance(touches[id].y, y) > distance_y) {
        distance_y = distance(touches[id].y, y);
    } else {
        touches[id].y = y;
        distance_y = 0;
    }
    var dx = (x - touches[id].x) / 20,
        dy = (y - touches[id].y) / 20;
    socket.emit("scroll", { dx, dy });
}

function doubleFinger(e) {
    var changedTouches = e.changedTouches;
    if (changedTouches[0]) {
        scroll(0, e, changedTouches);
    }
    if (changedTouches[1]) {
        scroll(1, e, changedTouches);
    }
}

function onMove(e) {
    e.preventDefault();
    moved = true;
    if (e.touches.length == 1) {
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
    if (touch_end - touch_start < 300 && moved == false) {
        socket.emit("click", "left");
    }
    socket.emit("mouse_toggle", "up");
    var id = e.changedTouches[0].identifier;
    touches = touches.filter((el) => el.id != id);
}