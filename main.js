//key:value
//panel:app
var dict = {
    "start-panel": "start-app",
    "skills-panel": "skills-app",
}

const openedWindows = [];

$(document).ready(function () {
    setInterval(printTimeDate, 1000);
});

$('input[type="checkbox"]').change(function () {
    //console.log(this.id);
    let panel = document.getElementById(getKeyByValue(dict, this.id));

    if ($(this).is(':checked') && (panel.classList.contains("open-popup") || panel.classList.contains("open-window"))) {
        $('input[type="checkbox"]').not(this).prop('checked', false);
        //console.log("i am true, the rest r false");
    }

    if ($(this).not(':checked') && panel.classList.contains("open-window")) {
        $(this).prop('checked', true);
        //console.log("check back the box for opened panel");
    }
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

let startPanel = document.getElementById('start-panel');

//start pop up btn will open and close the start panel
function toggleStartPopup() {
    if (startPanel.classList.contains("open-popup")) {
        startPanel.classList.remove("open-popup");

        if (openedWindows.length <= 0) return;

        var mostRecentWindow = openedWindows[openedWindows.length - 1];
        let btn = document.getElementById(dict[mostRecentWindow]);

        btn.checked = true;
    }
    else {
        startPanel.classList.add("open-popup");
    }
}

function openWindow(panel) {

    let window = document.getElementById(panel);

    if (!window.classList.contains("open-window")) {
        window.classList.add("open-window");
        openedWindows.push(panel);
        window.style.zIndex = openedWindows.length - 1;
    }

    if (startPanel.classList.contains("open-popup")) {
        startPanel.classList.remove("open-popup");
    }
}

function closeWindow(panel) {

    let window = document.getElementById(panel);
    let btn = document.getElementById(dict[panel]);

    if (window.classList.contains("open-window")) {
        window.classList.remove("open-window");
        btn.checked = false;
        openedWindows.splice(window.style.zIndex, 1);
        window.style.zIndex = -1;
    }
}

function closeWebpg() {
    let text = "Shut down?"
    if (confirm(text) == true)
        window.close();
}

function printTimeDate() {
    var today = new Date();

    var time = today.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');

    var dd = today.getDate()
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var date = dd + '/' + mm + '/' + yyyy;

    document.getElementById("time").innerHTML = time;
    document.getElementById("date").innerHTML = date;
}