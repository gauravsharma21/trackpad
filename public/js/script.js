const socket = io();
var body = document.getElementById("screen");
var lock = true;

var mc = new Hammer.Manager(body);

var move = new Hammer.Pan({
    event: "pan",
    pointers: 1,
    threshold: 0
})

var tap1 = new Hammer.Tap({
    event: "left_click",
    pointers: 1,
    taps: 1,
    interval: 0,
    threshold: 10
});

var tap2 = new Hammer.Tap({
    event: "right_click",
    pointers: 2
});

document.getElementById("lock_button").addEventListener("click", () => {
    if(!lock){
        mc.add(move);
        mc.add(tap1);
        mc.add(tap2);
    }else{
        mc.remove(move);
        mc.remove(tap1);
        mc.remove(tap2);
    }
    lock = !lock;
});

// document.getElementById("key_button").addEventListener("click", () => {
//     document.getElementById("text").focus();
// });

mc.add(move);
mc.add(tap1);
mc.add(tap2);

var init_x = 0,
    init_y = 0,
    final_x,
    final_y,
    left_click;

mc.on("panstart", (ev) => {
    var curr_time = new Date().getTime();
    if (curr_time - left_click < 300) socket.emit("mouse_toggle", "down");
})

mc.on("panmove", (ev) => {

    final_x = init_x + 1.5 * ev.deltaX;
    final_y = init_y + 1.5 * ev.deltaY;
    socket.emit("move", { final_x, final_y });
})

mc.on("panend", (ev) => {
    init_x = final_x;
    init_y = final_y;
    socket.emit("mouse_toggle", "up");
})

mc.on("left_click", (ev) => {
    left_click = new Date().getTime();
    socket.emit("click", "left");
})

mc.on("right_click", (ev) => {
    socket.emit("click", "right");
})