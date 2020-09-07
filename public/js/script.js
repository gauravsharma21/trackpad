const socket = io();

var mouse = document.getElementById("screen");
var lock_button = document.getElementById("lock_button");
var toggle_button = document.getElementById("toggle_button");
var keyboard = document.getElementById("keys");

var lock = false,
    toggle = true;

var ms = new Hammer.Manager(mouse);
var mb = new Hammer.Manager(lock_button);

var move = new Hammer.Pan({
    event: "pan",
    pointers: 1,
    threshold: 0
})

var tap1 = new Hammer.Tap({
    event: "left_click",
    pointers: 1,
    taps: 1
});

var tap2 = new Hammer.Tap({
    event: "right_click",
    pointers: 2
});

var tap3 = new Hammer.Tap({
    event: "double_tap",
    taps: 2
});

mb.add(tap3);
ms.add(move);
ms.add(tap1);
ms.add(tap2);

var left_click;

ms.on("panstart", (ev) => {
    var curr_time = new Date().getTime();
    if (curr_time - left_click < 300) socket.emit("mouse_toggle", "down");
    socket.emit("init");
})

ms.on("panmove", (ev) => {
    var dx = (1.5) * ev.deltaX,
        dy = (1.5) * ev.deltaY;

    socket.emit("move", { dx, dy });
})

ms.on("panend", (ev) => {
    socket.emit("mouse_toggle", "up");
})

ms.on("left_click", (ev) => {
    left_click = new Date().getTime();
    socket.emit("click", "left");
})

ms.on("right_click", (ev) => {
    socket.emit("click", "right");
})

mb.on("double_tap", (ev) => {
    if (lock) {
        ms.remove(move);
        ms.remove(tap1);
        ms.remove(tap2);
    } else {
        ms.add(move);
        ms.add(tap1);
        ms.add(tap2);
    }
    if (lock) {
        lock_button.style.backgroundColor = "red";
    } else {
        lock_button.style.backgroundColor = "white";
    }
    lock = !lock;
})

toggle_button.addEventListener("click", (e) => {
    if (toggle) {
        keyboard.style.display = "flex";
        mouse.style.display = "none";
        toggle_button.innerHTML = "Mouse";
    } else {
        keyboard.style.display = "none";
        mouse.style.display = "flex";
        toggle_button.innerHTML = "Keyboard";
        socket.emit('key_toggle', 'shift', 'up');
    }
    toggle = !toggle;
})
var children = keyboard.getElementsByTagName("div");

var isUpperCase = false;

for (var i = 0; i < children.length; ++i) {
    var row = children[i].getElementsByTagName("div");
    for (var j = 0; j < row.length; ++j) {
        row[j].addEventListener("click", (e) => {
            var val = (e.target.innerHTML);
            if (val === 'up') {
                isUpperCase = !isUpperCase;
                if (isUpperCase)
                    socket.emit('key_toggle', 'shift', 'down');
                else
                    socket.emit('key_toggle', 'shift', 'up');
                return;
            }
            socket.emit("type", val);
        })
    }
}