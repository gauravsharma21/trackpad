const robot = require('robotjs');

function move_mouse({ dx, dy, x, y }) {
    robot.moveMouse(x + dx, y + dy);
}

function click_mouse(val) {
    robot.mouseClick(val);
}

function toggle_mouse(val) {
    robot.mouseToggle(val);
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
    mouse_position,
    getScreenSize
}