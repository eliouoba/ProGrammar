//Josiah Hsu

let errors, time, wpm, tracker, newlinecount;
let start, end, interval;
let typeRef;

const stats = document.getElementById("stats");
const toType = document.getElementById("toType");

//determine lesson from url
const urlParams = new URLSearchParams(window.location.search);
let lessonFile = urlParams.get("lesson");

//load lesson into document
let httpx = new XMLHttpRequest();
httpx.open("GET", "files/" + lessonFile);
httpx.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200)
            typeRef = this.responseText.replace(/    /g, "\t").replace(/\r/g, '');
        else if (this.status == 404)
            typeRef = "The lesson you selected could not be found.";
        init();
    }
};
httpx.send();

/**
 * init - sets initial state
 */
function init() {
    errors = 0;
    time = 0;
    wpm = 0;
    newlinecount = 0;
    tracker = [];
    document.addEventListener("keydown", initType);
    makeText();
    window.clearInterval(interval);
}

/**
 * updateStats - updates wpm and time
 */
function updateStats() {
    time = (Date.now() - start) / 1000;
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
        interval = window.setInterval(updateStats, 250);
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
            if(tracker.pop() == '\n'){
                newlinecount--;
                window.scrollBy(0,-24.5);
            }
            break;
        case "Enter":
            tracker.push('\n');
            if(++newlinecount > 2)
                window.scrollBy(0, 25);
            break;
        case " ":
            keydownEvent.preventDefault();
            tracker.push(' ');
            break;
        case "Shift": //no input for shift
            return;
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
    let i;
    errors = 0;

    //typed portion
    text += '<b>';
    for (i = 0; i < tracker.length; i++) {
        let c = tracker[i];
        let correct = (c == typeRef[i]);
        c = convertReserved(c);

        if (!correct) {
            errors++;
            c = convertInvis(c);
            c = `<mark>${c}</mark>`;
            if (typeRef[i] == '\n')
                c += '\n';
        }
        text += c;
    }
    text += '</b>'

    //untyped portion
    text += '<span style="color:gray">'
    if (i < typeRef.length) {
        //underlines next character
        text += `<u>${convertInvis(convertReserved(typeRef[i++]))}</u>`;
    }

    while (i < typeRef.length) {
        text += convertReserved(typeRef[i++]);
    }
    text += '</span>'

    toType.innerHTML = text;
    if (tracker.length == typeRef.length)
        endLesson();
    else
        stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
}

/**
 * convertReserved - converts reserved characters to their character codes. 
 *                  Nonreserved characters are left unchanged.
 * @param {*} c The character to convert.
 * @returns The converted character if reserved, the character itself otherwise.
 */
function convertReserved(c) {
    switch (c) {
        case '&':
            c = '&#38;';
            break;
        case '<':
            c = '&#60;';
            break;
        case '>':
            c = '&#62;';
            break;
    }
    return c;
}

/**
 * convertInvis - converts nonvisible characters to a corresponding visible character.
 *              Visible characters are left unchanged.
 * @param {*} c The character to convert.
 * @returns The converted character if nonvisible, the character itself otherwise.
 */
function convertInvis(c) {
    switch (c) {
        case '\n':
            c = '&#8629;\n'; //carrage return symbol
            break;
        case '\t':
            c = '&#8594;\t'; //right arrow symbol
            break;
    }
    return c;
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