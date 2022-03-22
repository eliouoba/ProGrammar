//Josiah Hsu

let lessonText, typed, prevTyped, prevRef, newlinecount; //input
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
        if (this.status == 200){
            lessonText = this.responseText.replace(/    /g, "\t").replace(/\r/g, '');
            init();
        }
        else if (this.status == 404)
            toType.textContent = "ERROR: The lesson you selected could not be found.";
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
    typed = [];
    makeText(false);
    document.getElementById("toTypeBox").scrollTo(0,0);
    document.getElementById("reset").hidden = false;
    document.addEventListener("keydown", initType);
    window.clearInterval(interval);
}

/**
 * timer - keeps track of the time and wpm
 */
function timer() {
    time = (Date.now() - start) / 1000;
    wpm = Math.round((typed.length / 5) / (time / 60));
    updateStats();
}

/**
 * updateStats - updates wpm, errors, and time
 */
function updateStats() {
    const netwpm = Math.max(wpm-errors, 0);
    stats.textContent = `Time: ${time} Errors: ${errors} `+
                        `Net WPM: ${netwpm} Accuracy: ${accuracy}%`;
}

/**
 * updateAccuracy - calculates accuracy based on total entries/errors
 */
 function updateAccuracy(){
    entries++;
    const pos = typed.length-1;
    if(typed[pos] != lessonText[pos])
        totalErrors++;
    accuracy = (((entries - totalErrors) / entries) * 100).toFixed(2);
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
    const key = keydownEvent.key;
    let isInput = true;
    switch (key) {
        case "Tab":
            keydownEvent.preventDefault();
            typed.push('\t');
            break;
        case "Backspace":
            if(typed.pop() == '\n'){
                newlinecount--;
                document.getElementById("toTypeBox").scrollBy(0,-24.5);
            }
            isInput = false;
            break;
        case "Enter":
            typed.push('\n');
            if(++newlinecount > 2)
                document.getElementById("toTypeBox").scrollBy(0, 25);
            break;
        case " ":
            keydownEvent.preventDefault();
            typed.push(' ');
            break;
        default:
            if (keydownEvent.key.length == 1) {
                typed.push(keydownEvent.key);
            }
            else { //unsupported key
                return;
            }
    }
    makeText(isInput); 
}

/**
 * makeText - function to create representation of text typed 
 *              so far w/ HTML formatting/colors
 * @param {*} hasInput boolean - true if user has just inputted an entry
 */
function makeText(hasInput) {
    let text = ''; //typed portion
    let nextChar = convertReserved(lessonText[typed.length]); //current position
    let ref = ''; //reference portion
    let i;

    if(hasInput) {
        //input new entry
        updateAccuracy();
        i = typed.length-1;
        text = prevTyped + makeChar(i++);
        ref = prevRef.replace(nextChar, '');
    }
    else {
        //recreate text after removed entry
        errors = 0;
        for (i = 0; i < typed.length; i++) {
            text += makeChar(i);
        }
        
        if(typed.length == 0){
            //initializes prevRef when empty
            while (i < lessonText.length-1) {
                ref += convertReserved(lessonText[++i]);
            }
        }
        else
            ref = convertReserved(lessonText[++i]) + prevRef;
    }
    
    //save components for reuse
    prevTyped = text;
    prevRef = ref;

    //add formatting
    text = `<b>${text}</b>`
    if (typed.length < lessonText.length) {
        ref = `<u>${convertInvis(nextChar)}</u>${ref}`;
    }
    ref = `<span style="color:gray">${ref}</span>`;

    //displays updated text, checks for lesson completion
    toType.innerHTML = text + ref;
    updateStats();
    if (typed.length == lessonText.length)
        endLesson();
}

/**
 * makeChar - compares the typed character at a given position to
 *              the correct character in the reference text, 
 *              highlighting it if it's incorrect
 * @param {*} pos the position of the typed character
 * @returns the typed character at the given position, highlighted if incorrect
 */
function makeChar(pos){
    let c = typed[pos];
    let correct = (c == lessonText[pos]);
    c = convertReserved(c);

    if (!correct) {
        errors++;
        c = `<mark>${convertInvis(c)}</mark>`; //highlights error
        if (lessonText[pos] == '\n')
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
    alert(stats.textContent);
}
