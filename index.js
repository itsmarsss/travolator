const location_input = document.getElementById("new-stop");
const location_list = document.getElementById("stops");

var locations = [];

function remove(id) {
    locations = locations.filter(location => location.id !== id);
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

    if (locations.length > 1) {
        insert = `
        <div class="method">
            <div class="choices">
                <i class="fas fa-walking"></i>
                <i class="fa-solid fa-bicycle"></i>
                <i class="fa-solid fa-car"></i>
                <i class="fa-solid fa-bus"></i>
                <i class="fa-solid fa-train"></i>
                <i class="fa-solid fa-ferry"></i>
                <i class="fa-solid fa-plane"></i>
                <div class="vr"></div>
                <i class="fa-brands fa-uber"></i>
                <i class="fa-brands fa-lyft"></i>
                <span class="point">&rarr;</span>

            </div>
            <div class="infos">
                <span class="info"><span class="main-info">Leave:</span> XX:XX</span>
                <div class="vr"></div>
                <span class="info"><span class="main-info">Arrive:</span> XX:XX</span>
                <div class="vr"></div>
                <span class="info"><span class="main-info">Time:</span> XX:XX</span>
                <div class="vr"></div>
                <span class="info"><span class="main-info">Fee:</span> $XX.XX</span>
            </div>
        </div>
        ` + insert;
    }

    stops.innerHTML += insert;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
