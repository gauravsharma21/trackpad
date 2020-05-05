const robot = require('robotjs');

function move_mouse({ ax, ay }) {
    robot.moveMouse(ax, ay);
}

function click_mouse(val) {
    robot.mouseClick(val);
}

function toggle_mouse(val) {
    if (val === "down")
        robot.mouseToggle("down");
    else
        robot.mouseToggle("up");
}

function scroll_mouse({ dx, dy }) {
    robot.scrollMouse(dx, dy);
}

function mouse_position() {
    return robot.getMousePos();
}

module.exports = {
    move_mouse,
    click_mouse,
    toggle_mouse,
    scroll_mouse,
    mouse_position
}