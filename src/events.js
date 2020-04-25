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

function scroll_mouse({ dx, dy, wheight, wwidth }) {
    robot.scrollMouse(dx, dy);
}

module.exports = {
    move_mouse,
    click_mouse,
    toggle_mouse,
    scroll_mouse,
}