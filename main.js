//start custom class

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

//end custom class

//start variables

//key:value
//panel:app
var dict = {
    'start-panel': 'start-app',
    'skills-panel': 'skills-app',
    'exp-panel': 'exp-app',
    'edu-panel': 'edu-app',
    'cert-panel': 'cert-app',
    'contact-panel': 'contact-app',
    'hobby-panel': 'hobby-app'
};

//array of strings (name of panels opened)
const openedWindows = new ObservableArray([]);

//array of window elements
const winds = document.getElementsByClassName('window');

//array of buttons in apps-container
const navApps = document.querySelectorAll('.apps-container button');

//find startpanel element
const startPanel = document.getElementById('start-panel');

//get all the tab links and panes
const tabLinks = document.querySelectorAll('.folder-side-nav a');
const tabPanes = document.querySelectorAll('.tab-pane');

//get loading screen animation, loading div, desktop div
const loadingAnim = document.querySelector('.progress-bar .fill');
const loadingScreen = document.querySelector('.loading');

//get skills panel directory-display element
const skillsDirectory = document.querySelector('#skills-panel .directory-display');

//end variables

//start methods

$(document).ready(function () {
    initialize();
});

//init function
function initialize() {
    //init update for timedate
    setInterval(printTimeDate, 1000);

    //every time openWindows gets modified, items zIndex needs to be updated to new index in list
    //observe whenever the array gets modified, handle the change
    openedWindows.addObserver(handleArrayChange);

    //make all windows draggable and detect mousedown
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
                    topTheWindow(winds[i]);
                }
            }
        });
    }

    //to close startPanel when mouse down on places !startPanel !apps & when click on any apps
    document.addEventListener('mousedown', function (event) {
        let apps = document.getElementsByClassName('app');
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

    //add a click event listener to each tab link
    tabLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');

            //remove the active class from all tab links and panes
            tabLinks.forEach((link) => {
                link.classList.remove('active');
            });
            tabPanes.forEach((pane) => {
                pane.classList.remove('active');
            });

            //add the active class to the clicked tab link and pane
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            //set directory path to active tab name
            skillsDirectory.innerHTML = "Skills > " + link.innerHTML;
        });
    });

    //hide loading screen & show desktop when loading anim is completed
    loadingAnim.addEventListener("animationend", () => {
        loadingScreen.style.animation = "fade-out 0.5s normal forwards";
    });
}

//called whenever array gets modified
function handleArrayChange(array) {
    for (let i = 0; i < array.length; i++) {
        //resets the zindex to their index in array
        document.getElementById(array[i]).style.zIndex = i;
    }
}

//drag logic
function dragWindow(panel) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    document.getElementById(panel.id + '-header').onmousedown = dragMouseDown;

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

        //when dragging is happening, disable mouse events for iframe
        $('.window-content iframe').css('pointer-events', 'none');

        var containerW, containerH, maxX, maxY;
        containerW = document.getElementById('desktop-screen').clientWidth;
        containerH = document.getElementById('desktop-screen').clientHeight;
        maxX = containerW - panel.offsetWidth - 1;
        maxY = containerH - panel.offsetHeight - 1;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if ((panel.offsetTop - pos2) <= maxY && (panel.offsetTop - pos2) >= 0) {
            panel.style.top = (panel.offsetTop - pos2) + 'px';
        }
        if ((panel.offsetLeft - pos1) <= maxX && (panel.offsetLeft - pos1) >= 0) {
            panel.style.left = (panel.offsetLeft - pos1) + 'px';
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        //when dragging stops, enable mouse events for iframe
        $('.window-content iframe').css('pointer-events', 'auto');
    }
}

//helper function to read key by value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//toggle other btn false when setting a certain one to true
function setBtnActive(btn, isActive) {
    navApps.forEach((app) => {
        app.classList.remove('active');
    });

    if (isActive) {
        btn.classList.add('active');
    }
}

//find the most recent window and set its btn to active
function checkMostRecentWindow() {
    if (openedWindows.length <= 0) return;

    var mostRecentWindow = openedWindows.get(openedWindows.length - 1);
    let btn = document.getElementById(dict[mostRecentWindow]);
    setBtnActive(btn, true);
}

//start pop up btn will open and close the start panel
function toggleStartPopup() {
    let btn = document.getElementById(dict[startPanel.id]);

    if (startPanel.classList.contains('open-popup')) {
        closeStartPopup();
    }
    else {
        startPanel.classList.add('open-popup');
        setBtnActive(btn, true);
    }
}

//close the start panel when anywhr else is clicked
function closeStartPopup() {
    if (startPanel.classList.contains('open-popup')) {
        startPanel.classList.remove('open-popup');

        let btn = document.getElementById(dict[startPanel.id]);
        setBtnActive(btn, false);

        checkMostRecentWindow();
    }
}

//set window as highest layer
function topTheWindow(panel) {
    //selected open window will be removed and pushed into the list agn
    openedWindows.splice(panel.style.zIndex, 1)    //removed from list
    openedWindows.push(panel.id);   //pushed window back into list
    checkMostRecentWindow();
}

//open certain window and set btn active
function openWindow(panel) {

    let window = document.getElementById(panel);
    let btn = document.getElementById(dict[panel]);

    if (!window.classList.contains('open-window')) {
        window.classList.add('open-window');
        openedWindows.push(panel);
        window.style.zIndex = openedWindows.length - 1;

        setBtnActive(btn, true);
    }
    else {
        topTheWindow(window);
    }
    closeStartPopup();
}

//close certain window and set btn inactive
function closeWindow(panel) {

    let window = document.getElementById(panel);
    let btn = document.getElementById(dict[panel]);

    if (window.classList.contains('open-window')) {
        window.classList.remove('open-window');
        setBtnActive(btn, false);

        openedWindows.splice(window.style.zIndex, 1);
        window.style.zIndex = -1;

        checkMostRecentWindow();
    }
}

//prompt to close the portfolio webpg
function closeWebpg() {
    let text = 'Shut down?'
    if (confirm(text) == true)
        window.close();
}

//update display of time and date
function printTimeDate() {
    var today = new Date();

    var time = today.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');

    var dd = today.getDate()
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var date = dd + '/' + mm + '/' + yyyy;

    document.getElementById('time').innerHTML = time;
    document.getElementById('date').innerHTML = date;
}

//end methods