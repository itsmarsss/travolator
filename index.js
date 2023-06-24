const from_location_input = document.getElementById("from");
const to_location_input = document.getElementById("to");
const location_input = document.getElementById("new-stop");

const autocomplete = document.getElementById("autocomplete");

const location_list = document.getElementById("stops");

var locations = [];

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
        if (locations[i].id == id) {
            locations[i].method = index;
            break;
        }
    }

    rerender();
}

function rerender() {
    location_list.innerHTML = "";

    locations.forEach(function (location, index) {
        const id = location.id;
        const name = location.name || "N/A";
        const addr = location.addr || "N/A";

        const method = location.method;

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
        <div class="time">
            <span class="info"><span class="main-info">Leave:</span> <input type="datetime-local" class="date-input"></span>
            <span class="info"><span class="main-info">Arrive:</span> <input type="datetime-local" class="date-input"></span>
        </div>
        <div class="trip-info">
            <span class="info"><span class="main-info">Time:</span> <input type="time" class="info-input"></span>
            <span class="info"><span class="main-info">Fees:</span> <input type="number" min="0.00" max="10000.00" step="0.01" class="info-input"></span>
        </div>
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