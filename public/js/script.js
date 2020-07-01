const socket = io();
var init_x = 0,
    init_y = 0,
    init_x_mobile = 0,
    init_y_mobile = 0,
    final_x = 0,
    final_y = 0,
    start_time,
    max_distance_x = 0,
    max_distance_y = 0;

function onStart(e) {
    e.preventDefault();
    init_x_mobile = e.touches[0].clientX;
    init_y_mobile = e.touches[0].clientY;
    start_time = new Date().getTime();
}

function onMove(e) {
    var curr_x_mobile = e.touches[0].clientX;
    var curr_y_mobile = e.touches[0].clientY;
    var curr_time = new Date().getTime();

    var elapsed_time = curr_time - start_time;
    var distance_x_mobile = curr_x_mobile - init_x_mobile;
    var distance_y_mobile = curr_y_mobile - init_y_mobile;
    if (Math.abs(distance_x_mobile) >= max_distance_x &&
        Math.abs(distance_y_mobile) >= max_distance_y) {
        max_distance_x = Math.abs(distance_x_mobile);
        max_distance_y = Math.abs(distance_y_mobile);
    } else {
        onStop(e);
        onStart(e);
    }

    var speed_x = Math.max(1.5, Math.abs(distance_x_mobile) / elapsed_time);
    var speed_y = Math.max(1.5, Math.abs(distance_y_mobile) / elapsed_time);

    final_x = init_x + distance_x_mobile * speed_x;
    final_y = init_y + distance_y_mobile * speed_y;
    socket.emit("move", { final_x, final_y });
}

function onStop(e) {
    init_x = final_x;
    init_y = final_y;
}