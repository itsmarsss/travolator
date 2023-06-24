const from_location_input = document.getElementById("from");
const to_location_input = document.getElementById("to");
const location_input = document.getElementById("new-stop");

const autocomplete = document.getElementById("autocomplete");

const location_list = document.getElementById("stops");

var locations = [];

async function queryAI() {

    const parsed_from = from_location_input.value.split(/,(.*)/s);
    const parsed_to = to_location_input.value.split(/,(.*)/s);

    if (parsed_from.length <= 2) {
        from_location_input.style.background = "#f4d7d7";
        return;
    }
    if (parsed_to.length <= 2) {
        to_location_input.style.background = "#f4d7d7";
        return;
    }

    var from_name = parsed_from[0];
    var from_addr = parsed_from[1];

    aiAdd("building", from_name, from_addr, "Added by you!");

    console.log("Calling GPT3");

    location_list.innerHTML = `
<div style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
    <h3 style="font-family: 'Poppins';">Loading...</h3>
</div>
    `;

    locations = [];

    var url = "https://api.openai.com/v1/completions";
    var bearer = 'Bearer';
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": `Generate real-life places between ${from_location_input.value} and ${to_location_input.value}, your response must be in JSON format as follows:\n[\n{\n"type": "<insert attraction type: building, landscape, nature>",\n"name": "<insert place name here>",\n"address": "<insert exact address here>",\n"description": "<insert description here>"\n}... // continue in this list format\n]\nStart now:`,
            "temperature": 0.7,
            "max_tokens": 1000,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        })
    }).then(response => response.json())
        .then(data => {
            console.log(data.choices[0].text);

            var replyLines = data.choices[0].text;

            var GPTReply = JSON.parse(replyLines);

            for (var i = 0; i < GPTReply.length; i++) {

                const type = GPTReply[i].type || "building";
                const name = GPTReply[i].name || "N/A";
                const addr = GPTReply[i].address || "N/A";
                const desc = GPTReply[i].description || "N/A";

                aiAdd(type, name, addr, desc);
            }

            var to_name = parsed_to[0];
            var to_addr = parsed_to[1];

            aiAdd("building", to_name, to_addr, "Added by you!");

        })
        .catch(err => {
            console.error("Error: " + err.message.toString());
            location_list.innerHTML = `
<h1 style="color: #212121; text-align: center">
        Ran into an error; try again later.
</h1>
            `;
        });
}

function aiAdd(type, name, addr, desc) {
    const id = "id" + Math.random().toString(16).slice(2);

    const json = {
        "id": id,
        "type": type,
        "name": name,
        "addr": addr,
        "desc": desc,
        "method": null,
        "leave": null,
        "arrive": null,
        "time": null,
        "fees": null
    };

    locations.push(json);

    rerender();
}

function updateLeave(src) {
    const source = src;
    const index = getIndex(source.getAttribute("data-id"));

    locations[index].leave = source.value;
}
function updateArrive(src) {
    const source = src;
    const index = getIndex(source.getAttribute("data-id"));

    locations[index].arrive = source.value;
}
function updateTime(src) {
    const source = src;
    const index = getIndex(source.getAttribute("data-id"));

    locations[index].time = source.value;
}
function updateFees(src) {
    const source = src;
    const index = getIndex(source.getAttribute("data-id"));

    locations[index].fees = source.value;
}

function moveUp(id) {
    const index = getIndex(id);

    try {
        locations[index].method = null;
        locations[index].leave = null;
        locations[index].arrive = null;
        locations[index].time = null;
        locations[index].fees = null;
    }
    catch (err) {
    }

    try {
        locations[index - 1].method = null;
        locations[index - 1].leave = null;
        locations[index - 1].arrive = null;
        locations[index - 1].time = null;
        locations[index - 1].fees = null;
    }
    catch (err) {
    }

    array_move(locations, index, Math.max(0, index - 1));

    try {
        locations[index - 2].method = null;
        locations[index - 2].leave = null;
        locations[index - 2].arrive = null;
        locations[index - 2].time = null;
        locations[index - 2].fees = null;
    }
    catch (err) {
    }

    rerender();
}

function moveDown(id) {
    const index = getIndex(id);

    try {
        locations[index].method = null;
        locations[index].leave = null;
        locations[index].arrive = null;
        locations[index].time = null;
        locations[index].fees = null;
    }
    catch (err) {
    }

    try {
        locations[index - 1].method = null;
        locations[index - 1].leave = null;
        locations[index - 1].arrive = null;
        locations[index - 1].time = null;
        locations[index - 1].fees = null;
    }
    catch (err) {
    }

    array_move(locations, index, Math.min(locations.length - 1, index + 1));

    try {
        locations[index].method = null;
        locations[index].leave = null;
        locations[index].arrive = null;
        locations[index].time = null;
        locations[index].fees = null;
    }
    catch (err) {
    }

    rerender();
}

function getIndex(id) {
    for (var i = 0; i < locations.length; i++) {
        if (locations[i].id === id) {
            return i;
        }
    }
}

function remove(id) {
    locations = locations.filter(location => location.id !== id);

    rerender();
}

function add() {
    const parsed = location_input.value.split(/,(.*)/s);

    var name;
    var addr;
    if (parsed.length > 2) {
        name = parsed[0];
        addr = parsed[1];
    } else {
        location_input.style.background = "#c4434325";
        return;
    }

    if (name.length == 0) {
        location_input.style.background = "#c4434325";
        return;
    }

    location_input.value = "";

    const id = "id" + Math.random().toString(16).slice(2);

    const json = {
        "id": id,
        "type": "building",
        "name": name,
        "addr": addr,
        "desc": "Added by you!",
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
    const idx = getIndex(id);

    locations[idx].method = index;

    const origin = locations[idx].addr.replace(/[\/\\]/g, '');
    const destin = locations[idx + 1].addr.replace(/[\/\\]/g, '');

    var travelmode = "driving";
    switch (locations[idx].method) {
        case 0:
            travelmode = "walking";
            break;
        case 1:
            travelmode = "bicycling";
            break;
        case 2:
            travelmode = "driving";
            break;
        case 3:
            travelmode = "transit";
            break;
        case 4:
            travelmode = "flights";

            window.open(
                `https://www.google.com/maps/dir/${origin}/${destin}`,
                "_blank");
            return;
        case 5:
            window.open(
                `https://m.uber.com/looking`,
                "_blank");
            return;
        case 6:
            window.open(
                `https://ride.lyft.com/`,
                "_blank");
            return;

    }

    window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destin}&travelmode=${travelmode}`,
        "_blank");

    rerender();
}

function rerender() {
    location_list.innerHTML = "";

    locations.forEach(function (location, index) {
        const id = location.id;
        const type = location.type || "building";
        const name = location.name || "N/A";
        const addr = location.addr || "N/A";

        const desc = location.desc || "Added by you!";

        const method = location.method;

        const leave = location.leave || "XX:XX";
        const arrive = location.arrive || "XX:XX";
        const time = location.time || "XX:XX";
        const fees = location.fees || "$XX.XX";

        var attraction_type = `<i class="fa-solid fa-building"></i>`;

        if (String(type).toLowerCase() === "landscape") {
            attraction_type = `<i class="fa-solid fa-image"></i>`;
        } else if (String(type).toLowerCase() === "nature") {
            attraction_type = `<i class="fa-solid fa-tree"></i>`;
        }

        var insert = `
<div class="stop" title="${desc}">
    <div class="location">
        <h4 class="name">${attraction_type}&emsp;${name}</h4>
        <h4 class="addr">${addr}</h4>
    </div>
    <div class="editor">
        <div class="move">
            <button onclick="moveUp('${id}')">&uarr;</button>
            <button onclick="moveDown('${id}')">&darr;</button>
        </div>
        <button onclick="remove('${id}')">&times;</button>
    </div>
</div>
        `;

        if ((locations.length > 1) && (index != locations.length - 1)) {
            insert = insert + `
<div class="method">
    <div class="choices">
        <i class="fas fa-walking ${(method == 0 ? "active" : "")}" onclick="selectMethod('${id}', 0)"></i>
        <i class="fa-solid fa-bicycle ${(method == 1 ? "active" : "")}" onclick="selectMethod('${id}', 1)"></i>
        <i class="fa-solid fa-car ${(method == 2 ? "active" : "")}" onclick="selectMethod('${id}', 2)"></i>
        <i class="fa-solid fa-train ${(method == 3 ? "active" : "")}" onclick="selectMethod('${id}', 3)"></i>
        <i class="fa-solid fa-plane ${(method == 4 ? "active" : "")}" onclick="selectMethod('${id}', 4)"></i>
        <div class="vr"></div>
        <i class="fa-brands fa-uber ${(method == 5 ? "active" : "")}" onclick="selectMethod('${id}', 5)"></i>
        <i class="fa-brands fa-lyft ${(method == 6 ? "active" : "")}" onclick="selectMethod('${id}', 6)"></i>
        <span class="point">&rarr;</span>

    </div>
    <div class="infos">
        <div class="time">
            <span class="info"><span class="main-info">Leave:</span> <input data-id="${id}" type="datetime-local" class="date-input" value="${leave}" oninput="updateLeave(this)"></span>
            <span class="info"><span class="main-info">Arrive:</span> <input data-id="${id}" type="datetime-local" class="date-input" value="${arrive}" oninput="updateArrive(this)"></span>
        </div>
        <div class="trip-info">
            <span class="info"><span class="main-info">Time:</span> <input data-id="${id}" type="time" class="info-input" value="${time}" oninput="updateTime(this)"></span>
            <span class="info"><span class="main-info">Fees:</span> <input data-id="${id}" type="number" min="0.00" max="10000.00" step="0.01" class="info-input" value="${fees}" oninput="updateFees(this)"></span>
        </div>
    </div>
</div>
        `;
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

rerender();

from_location_input.addEventListener("keyup", function (e) {
    const inputValue = e.key;

    if (/^[a-zA-Z]$/.test(inputValue)) {
        handleIn(from_location_input);
    }
});
to_location_input.addEventListener("keyup", function (e) {
    const inputValue = e.key;

    if (/^[a-zA-Z]$/.test(inputValue)) {
        handleIn(to_location_input);
    }
});
location_input.addEventListener("keyup", function (e) {
    const inputValue = e.key;

    if (/^[a-zA-Z]$/.test(inputValue)) {
        handleIn(location_input);
    }
});

from_location_input.addEventListener("focusout", function () {
    hideComplete();
});
to_location_input.addEventListener("focusout", function () {
    hideComplete();
});
location_input.addEventListener("focusout", function () {
    hideComplete();
});

function handleIn(element) {
    console.log("Fetching");

    if (element.value.length == 0) {
        return;
    }

    element.style.background = "#fff";

    var requestOptions = {
        method: 'GET',
    };

    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${element.value}&apiKey=9fdec571bd144a86b3d7c4663ff7b27d`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            autocomplete.style.display = "flex";
            autocomplete.style.top = element.getBoundingClientRect().top + element.offsetHeight + 5 + "px";
            autocomplete.style.left = element.getBoundingClientRect().left + "px";
            autocomplete.style.width = element.offsetWidth + "px";

            autocomplete.innerHTML = "";

            for (var i = 0; i < result.features.length; i++) {

                console.log(result.features[i]);

                const insert = `
                <span data-addr="${result.features[i].properties.address_line1 + ", " + result.features[i].properties.address_line2}" class="complete"><b>${result.features[i].properties.address_line1}</b>, ${result.features[i].properties.address_line2}</span>
                `;

                autocomplete.innerHTML += insert;
            }

            const spans = document.getElementsByClassName("complete");

            for (var i = 0; i < spans.length; i++) {
                (function (index) {
                    spans[index].addEventListener("click", function () {
                        element.value = spans[index].getAttribute("data-addr");
                        autocomplete.innerHTML = "";
                        autocomplete.style.display = "none";
                    });
                })(i);
            }

            if (!(from_location_input === document.activeElement) && !(to_location_input === document.activeElement) && !(location_input === document.activeElement)) {
                autocomplete.innerHTML = "";
                autocomplete.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
}

function hideComplete() {
    setTimeout(function () {
        autocomplete.innerHTML = "";
        autocomplete.style.display = "none";
    }, 300);
}

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};