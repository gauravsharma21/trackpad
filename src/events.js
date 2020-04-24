const robot = require('robotjs');

function move_mouse({ ax, ay, wheight, wwidth }) {
    robot.moveMouse(ax, ay);
}

function click_mouse() {
    robot.mouseClick();
}

function toggle_mouse(val) {
    if (val === "down")
        robot.mouseToggle("down");
    else
        robot.mouseToggle("up");
}

module.exports = {
    move_mouse,
    click_mouse,
    toggle_mouse
}