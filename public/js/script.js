const socket = io();
var init_x = 0,
    init_y = 0,
    init_x_mobile = 0,
    init_y_mobile = 0,
    final_x = 0,
    final_y = 0;

function onStart(e) {
    e.preventDefault();
    init_x_mobile = e.touches[0].clientX;
    init_y_mobile = e.touches[0].clientY;
}

function onMove(e) {
    var curr_x = e.touches[0].clientX;
    var curr_y = e.touches[0].clientY;

    var distance_x = curr_x - init_x_mobile;
    var distance_y = curr_y - init_y_mobile;

    final_x = init_x + distance_x;
    final_y = init_y + distance_y;
    // socket.emit("move", { final_x, final_y });
}

function onStop(e) {
    init_x = final_x;
    init_y = final_y;
}