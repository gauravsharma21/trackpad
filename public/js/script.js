const socket = io();

async function loadData() {
    try {
        const data = await (await fetch("./size")).json();
        localStorage.setItem("height", data.height);
        localStorage.setItem("width", data.width);
    }
    catch (e) {
        alert("Something went wrong")
    }
}

function set() {
    var body = document.getElementById("screen");
    var button = document.getElementById("lock_button");

    var lock = false;

    var ms = new Hammer.Manager(body);
    var mb = new Hammer.Manager(button);

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
    // document.getElementById("lock_button").addEventListener("click", () => {
    //     if (!lock) {
    //         ms.add(move);
    //         ms.add(tap1);
    //         ms.add(tap2);
    //     } else {
    //         ms.remove(move);
    //         ms.remove(tap1);
    //         ms.remove(tap2);
    //     }
    //     lock = !lock;
    // });



    ms.add(move);
    ms.add(tap1);
    ms.add(tap2);

    var init_x = 0,
        init_y = 0,
        final_x,
        final_y,
        left_click;

    ms.on("panstart", (ev) => {
        var curr_time = new Date().getTime();
        if (curr_time - left_click < 300) socket.emit("mouse_toggle", "down");
    })

    ms.on("panmove", (ev) => {
        var height = localStorage.getItem("height") - 0.001;
        var width = localStorage.getItem("width") - 0.001;

        final_x = init_x + (1.5) * ev.deltaX;
        final_y = init_y + (1.5) * ev.deltaY;

        if (final_x < 0) final_x = 0;
        if (final_y < 0) final_y = 0;
        if (final_x > width) final_x = width;
        if (final_y > height) final_y = height;
        socket.emit("move", { final_x, final_y });
    })

    ms.on("panend", (ev) => {
        init_x = final_x;
        init_y = final_y;
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
            button.style.backgroundColor = "red";
        }else{
            button.style.backgroundColor = "white";
        }
        lock = !lock;
    })
}

