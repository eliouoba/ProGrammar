//Josiah Hsu
let errors, time, wpm, tracker, start, end, interval;
let toType;
const stats = document.getElementById("stats");
const typed = document.getElementById("typed");

init();

//load text into document
let x = new XMLHttpRequest();
x.open("GET", "files/SampleText2.txt"); //determines which file to load
x.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("toType").innerHTML = this.responseText;
        toType = document.getElementById("toType").innerHTML;
    }
};
x.send();

/**
 * init - sets initial state
 */
function init() {
    errors = 0;
    time = 0;
    wpm = 0;
    tracker = [];
    document.addEventListener("keydown", initType);
    typed.innerHTML = '<span style="color:gray">Begin typing the above text to start.</span>';
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
    window.clearInterval(interval);
}

/**
 * timer - updates stats every second
 */
function timer() {
    time++;
    wpm = Math.round((tracker.length / 5) / (time / 60));
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    document.removeEventListener("keydown", type);
    init();
}

/**
 * initType - special event for first input
 * @param {*} keydownEvent the keydownEvent upon first type
 */
function initType(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", initType);
        document.addEventListener("keydown", type);
        type(keydownEvent);
        interval = window.setInterval(timer, 1000)
        start = Date.now();
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} keydownEvent the keydownEvent 
 */
function type(keydownEvent) {
    switch (keydownEvent.key) {
        case "Tab":
            keydownEvent.preventDefault();
            tracker.push('\t');
            break;
        case "Backspace":
            tracker.pop();
            break;
        case "Enter":
            tracker.push('\n')
            break;
        default:
            if (keydownEvent.key.length == 1) {
                tracker.push(keydownEvent.key);
            }
    }
    makeText();
}

/**
 * makeText - function to create representation of text typed 
 *              so far w/ HTML formatting/colors
 */
function makeText() {
    let text = '';
    errors = 0;
    for (var i = 0; i < tracker.length; i++) {
        let c = tracker[i];
        if (c == toType[i]) {
            if (c == '\n')
                c = '<br>';
            else if (c == '\t')
                c = '&#09;'
        } else {
            errors++;
            if (c == ' ')
                c = '_';
            else if (c == '\n')
                c = '<br>>';
            else if (c == '\t')
                c = '|tab|';
            c = `<mark>${c}</mark>`;
        }
        text += c;
    }
    typed.innerHTML = text;
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;

    if (tracker.length == toType.length)
        endLesson();
    else
        typed.innerHTML += '_';
}

/**
 * endLesson - function that sets lesson to completed state
 */
function endLesson() {
    end = Date.now();
    clearInterval(interval);
    document.removeEventListener("keydown", type);
    time = (end - start) / 1000;
    wpm = Math.round((tracker.length / 5) / (time / 60))
    const netwpm = wpm - errors;
    alert(`Gross WPM: ${wpm}\nErrors: ${errors}\nNet WPM: ${netwpm}`);
    stats.textContent = `Final time: ${time} Errors: ${errors} Net WPM: ${netwpm}`;
}