//key:value
//panel:app
var dict = {
    "start-panel": "start-app",
    "skills-panel": "skills-app",
    "exp-panel": "exp-app",
    "edu-panel": "edu-app",
    "cert-panel": "cert-app",
    "contact-panel": "contact-app",
    "hobby-panel": "hobby-app"
}

//custom observer pattern for array
class ObservableArray {
    constructor(array) {
        this.array = array;
        this.callbacks = new Set();
    }

    get length() {
        return this.array.length;
    }

    push(...items) {
        const result = this.array.push(...items);
        this.notifyObservers();
        return result;
    }

    pop() {
        const result = this.array.pop();
        this.notifyObservers();
        return result;
    }

    shift() {
        const result = this.array.shift();
        this.notifyObservers();
        return result;
    }

    unshift(...items) {
        const result = this.array.unshift(...items);
        this.notifyObservers();
        return result;
    }

    splice(start, deleteCount, ...items) {
        const result = this.array.splice(start, deleteCount, ...items);
        this.notifyObservers();
        return result;
    }

    includes(item) {
        return this.array.includes(item);
    }

    get(index) {
        return this.array[index];
    }

    addObserver(callback) {
        this.callbacks.add(callback);
    }

    removeObserver(callback) {
        this.callbacks.delete(callback);
    }

    notifyObservers() {
        for (const callback of this.callbacks) {
            callback(this.array);
        }
    }
}

function handleArrayChange(array) {
    for (let i = 0; i < array.length; i++) {
        //resets the zindex to their index in array
        document.getElementById(array[i]).style.zIndex = i;
    }
}

//array of strings (name of panels opened)
const openedWindows = new ObservableArray([]);

//every time openWindows gets modified, items zIndex needs to be updated to new index in list
//observe whenever the array gets modified, handle the change
openedWindows.addObserver(handleArrayChange);

let winds = document.getElementsByClassName("window");
for (let i = 0; i < winds.length; i++) {

    //made the windows draggable
    dragWindow(winds[i]);

    //detect clicks within window (mouse down on window)
    document.addEventListener('mousedown', function (event) {
        //if window is clicked
        if (winds[i].contains(event.target)) {
            //check if clicked window is in openedWindows (in case closed windows can be clicked on)
            if (openedWindows.includes(winds[i].id)) {
                //selected open window will be removed and pushed into the list agn
                openedWindows.splice(winds[i].style.zIndex, 1)    //removed from list
                openedWindows.push(winds[i].id);   //pushed window back into list
            }
        }
    });
}

//to close startPanel when mouse down on places !startPanel !apps & when click on any apps
document.addEventListener('mousedown', function (event) {
    let apps = document.getElementsByClassName("app");
    //check if mousedown is not within startpanel
    if (!startPanel.contains(event.target)) {

        //check if mousedown is not within apps
        for (let i = 0; i < apps.length; i++) {
            if (!apps[i].contains(event.target)) {
                continue;
            }
            else {
                return;
            }
        }
        closeStartPopup();
    }
});

//drag logic
function dragWindow(panel) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    document.getElementById(panel.id + "-header").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        var containerW, containerH, maxX, maxY;
        containerW = document.getElementById("desktop-screen").clientWidth;
        containerH = document.getElementById("desktop-screen").clientHeight;
        maxX = containerW - panel.offsetWidth - 1;
        maxY = containerH - panel.offsetHeight - 1;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if ((panel.offsetTop - pos2) <= maxY && (panel.offsetTop - pos2) >= 0) {
            panel.style.top = (panel.offsetTop - pos2) + "px";
        }
        if ((panel.offsetLeft - pos1) <= maxX && (panel.offsetLeft - pos1) >= 0) {
            panel.style.left = (panel.offsetLeft - pos1) + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

$(document).ready(function () {
    setInterval(printTimeDate, 1000);
});

//**logic for app selection and toggling is slightly screwed, rmb to fix!
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

function showMostRecentWindow() {
    if (openedWindows.length <= 0) return;

    var mostRecentWindow = openedWindows.get(openedWindows.length - 1);
    let btn = document.getElementById(dict[mostRecentWindow]);

    btn.checked = true;
}

let startPanel = document.getElementById('start-panel');

//start pop up btn will open and close the start panel
function toggleStartPopup() {
    if (startPanel.classList.contains("open-popup")) {
        startPanel.classList.remove("open-popup");

        showMostRecentWindow();
    }
    else {
        startPanel.classList.add("open-popup");
    }
}

//close the start panel when anywhr else is clicked
function closeStartPopup() {
    if (startPanel.classList.contains("open-popup")) {
        startPanel.classList.remove("open-popup");

        let btn = document.getElementById(dict[startPanel.id]);
        btn.checked = false;
    }
}

function openWindow(panel) {

    let window = document.getElementById(panel);
    let btn = document.getElementById(dict[panel]);

    if (!window.classList.contains("open-window")) {
        window.classList.add("open-window");
        openedWindows.push(panel);
        window.style.zIndex = openedWindows.length - 1;

        btn.checked = true;
    }
    closeStartPopup();
}

function closeWindow(panel) {

    let window = document.getElementById(panel);
    let btn = document.getElementById(dict[panel]);

    if (window.classList.contains("open-window")) {
        window.classList.remove("open-window");
        btn.checked = false;
        openedWindows.splice(window.style.zIndex, 1);
        //when openedwindows list changes (removed an item), windows nid to be sorted and reassigned a new index
        window.style.zIndex = -1;

        showMostRecentWindow();
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