//Josiah Hsu

let typeRef, tracker, newlinecount, oldTyped, oldRef; //typed
let time, errors, wpm, accuracy; //stats
let entries, totalErrors; //accuracy
let start, end, interval; //timer

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
    entries = 0;
    totalErrors = 0;
    time = 0;
    errors = 0;
    wpm = 0;
    accuracy = 100;
    newlinecount = 0;
    tracker = [];
    document.addEventListener("keydown", initType);
    makeText();
    window.clearInterval(interval);
}

/**
 * timer - keeps track of the time and wpm
 */
function timer() {
    time = (Date.now() - start) / 1000;
    wpm = Math.round((tracker.length / 5) / (time / 60));
    updateStats();
}

/**
 * updateStats - updates wpm, errors, and time
 */
function updateStats() {
    const netwpm = wpm-errors;
    stats.innerHTML = `Time: ${time.toFixed(3)} Errors: ${errors}
                        WPM: ${netwpm} Accuracy: ${accuracy.toFixed(2)}%`;
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    document.removeEventListener("keydown", type);
    document.getElementById("reset").blur();
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
        interval = window.setInterval(timer, 250);
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
                document.getElementById("toTypeBox").scrollBy(0,-24.5);
            }
            break;
        case "Enter":
            tracker.push('\n');
            if(++newlinecount > 2)
                document.getElementById("toTypeBox").scrollBy(0, 25);
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
    if(keydownEvent.key == "Backspace")
        makeText();
    else{
        updateAccuracy();
        addEntry();
    }
}

/**
 * updateAccuracy - calculates accuracy based on total entries/errors
 */
function updateAccuracy(){
    entries++;
    const pos = tracker.length-1;
    if(tracker[pos] != typeRef[pos])
        totalErrors++;
    accuracy = ((entries - totalErrors) / entries) * 100;
}

/**
 * addEntry - updates formatted representation of text 
 *              typed so far after new entry
 */
function addEntry(){
    let text = oldTyped;
    let i = tracker.length-1;

    text += checkCorrect(i);

    oldTyped = text;
    text = `<b>${text}</b>`

    text += '<span style="color:gray">'
    if (++i < typeRef.length) {
        //underlines next character
        text += `<u>${convertInvis(convertReserved(typeRef[i++]))}</u>`;
    }

    while (i < typeRef.length) {
        text += convertReserved(typeRef[i++]);
    }
    text += '</span>'

    displayText(text);
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
    for (i = 0; i < tracker.length; i++) {
        text += checkCorrect(i);
    }
    oldTyped = text;
    text = `<b>${text}</b>`

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

    displayText(text);
}

/**
 * displayText - displays the text on screen
 * @param {*} text The text to be displayed 
 */
function displayText(text){
    toType.innerHTML = text;
    if (tracker.length == typeRef.length)
        endLesson();
    else
        updateStats();
}

/**
 * checkCorrect - compares the typed character at a given position to
 *                  the correct character in the reference text, highlighting
 *                  it if it's incorrect
 * @param {*} pos the position of the typed character
 * @returns the typed character at the given position, highlighted if incorrect
 */
function checkCorrect(pos){
    let c = tracker[pos];
    let correct = (c == typeRef[pos]);
    c = convertReserved(c);

    if (!correct) {
        errors++;
        c = convertInvis(c);
        c = `<mark>${c}</mark>`;
        if (typeRef[pos] == '\n')
            c += '\n';
    }
    return c;
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
    updateStats();
}
