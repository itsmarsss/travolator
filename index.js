const location_input = document.getElementById("new-stop");
const location_list = document.getElementById("stops");

var locations = [];

function remove(id) {
    locations = locations.filter(location => location.id !== id);

    rerender();
}

function add() {
    const name = escapeHtml(location_input.value);
    const addr = "TBD";

    location_input.value = "";

    const id = "id" + Math.random().toString(16).slice(2);

    const json = {
        "id": id,
        "name": name,
        "addr": addr,
        "next": null,
        "method": null,
        "leave": null,
        "arrive": null,
        "time": null,
        "fees": null
    };

    locations.push(json);

    rerender();
}

function selectMethod(id, index) {
    for (var i = 0; i < locations.length; i++) {
        if (locations[i].id === id) {
            locations[i].method = index;
            break;
        }
    }
}

function rerender() {
    location_list.innerHTML = "";

    locations.forEach(function (location, index) {
        const id = location.id;
        const name = location.name || "N/A";
        const addr = location.addr || "N/A";

        const method = location.method || -1;

        const leave = location.leave || "XX:XX";
        const arrive = location.arrive || "XX:XX";
        const time = location.time || "XX:XX";
        const fees = location.fees || "$XX.XX";

        var insert = `
<div class="stop">
    <div class="location">
        <h4 class="name">${name}</h4>
        <h4 class="addr">${addr}</h4>
    </div>
    <div class="editor">
        <div class="move">
            <button>&uarr;</button>
            <button>&darr;</button>
        </div>
        <button onclick="remove('${id}')">&times;</button>
    </div>
</div>
        `;

        if (index > 0) {
            insert = `
<div class="method">
    <div class="choices">
        <i class="fas fa-walking ${(method == 0 ? "active" : "")}" onclick="selectMethod('${id}', 0)"></i>
        <i class="fa-solid fa-bicycle ${(method == 1 ? "active" : "")}" onclick="selectMethod('${id}', 1)"></i>
        <i class="fa-solid fa-car ${(method == 2 ? "active" : "")}" onclick="selectMethod('${id}', 2)"></i>
        <i class="fa-solid fa-bus ${(method == 3 ? "active" : "")}" onclick="selectMethod('${id}', 3)"></i>
        <i class="fa-solid fa-train ${(method == 4 ? "active" : "")}" onclick="selectMethod('${id}', 4)"></i>
        <i class="fa-solid fa-ferry ${(method == 5 ? "active" : "")}" onclick="selectMethod('${id}', 5)"></i>
        <i class="fa-solid fa-plane ${(method == 6 ? "active" : "")}" onclick="selectMethod('${id}', 6)"></i>
        <div class="vr"></div>
        <i class="fa-brands fa-uber ${(method == 7 ? "active" : "")}" onclick="selectMethod('${id}', 7)"></i>
        <i class="fa-brands fa-lyft ${(method == 8 ? "active" : "")}" onclick="selectMethod('${id}', 8)"></i>
        <span class="point">&rarr;</span>

    </div>
    <div class="infos">
        <span class="info"><span class="main-info">Leave:</span> ${leave}</span>
        <div class="vr"></div>
        <span class="info"><span class="main-info">Arrive:</span> ${arrive}</span>
        <div class="vr"></div>
        <span class="info"><span class="main-info">Time:</span> ${time}</span>
        <div class="vr"></div>
        <span class="info"><span class="main-info">Fees:</span> ${fees}</span>
    </div>
</div>
        ` + insert;
        }

        location_list.innerHTML += insert;
    });

    if (location_list.innerHTML.length == 0) {
        location_list.innerHTML = `
<h1 style="color: #212121; text-align: center">
        No planned stops? :(
</h1>
        `;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

rerender();
