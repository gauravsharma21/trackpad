const robot = require('robotjs');

function move_mouse({ final_x, final_y }) {
    robot.moveMouse(final_x, final_y);
}

function click_mouse(val) {
    robot.mouseClick(val);
}

function toggle_mouse(val) {
    robot.mouseToggle(val);
}

function scroll_mouse({ dx, dy }) {
    robot.scrollMouse(0, 1);
}

function mouse_position() {
    return robot.getMousePos();
}

function getScreenSize(){
    return {height, width} = robot.getScreenSize();
}

module.exports = {
    move_mouse,
    click_mouse,
    toggle_mouse,
    scroll_mouse,
    mouse_position,
    getScreenSize
}