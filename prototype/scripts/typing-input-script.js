//Josiah Hsu

//quick element references
const stats = document.getElementById("stats");
const toType = document.getElementById("toType");
const toTypeBox = document.getElementById("toTypeBox");
const resetButton = document.getElementById("reset");
const langSelect = document.getElementById("lang");
const defaultOption = document.getElementById("defaultOption");

//variables/constants
let lessonText, typed, newlinecount; //input
let time, errors, wpm, accuracy; //stats
let entries, totalErrors; //accuracy
let start, end, interval; //timer
const lineHeight = window.getComputedStyle(toType).lineHeight.replace("px", '');

//determine lesson from url
const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
const extension = urlParams.get("lang");

//load lesson into document
const httpx = new XMLHttpRequest();
httpx.open("GET", `files/${lessonFile}.${extension}`);
httpx.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200){
            lessonText = this.responseText.replace(/    /g, "\t").replace(/\r/g, '');
            resetButton.hidden = false;
            init();
        }
        else if (this.status == 404)
            toType.textContent = "ERROR: The lesson you selected could not be found.";
    }
};
httpx.send();

//set default option for langSelect
const options = langSelect.options;
for(var i = 0; i < options.length; i++){
    if(options[i].value == extension){
        defaultOption.textContent = options[i].text;
        visible = true;
    }
}

/**
 * changeLanguage - changes programming language and reloads page
 */
function changeLanguage() {
    const newExt = langSelect.value;
    if(newExt != extension){
        let url = window.location.href;
        url = `lesson.html?lesson=${lessonFile}&lang=${newExt}`;
        window.location = url;
    }
}

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
    makeText();
    toTypeBox.scrollTo(0,0);
    langSelect.disabled = false;
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
    stats.textContent = `Time: ${time.toFixed(2)} Errors: ${errors} ` +
                        `Net WPM: ${netwpm} Accuracy: ${accuracy.toFixed(2)}%`;
}

/**
 * updateAccuracy - calculates accuracy based on total entries/errors
 */
 function updateAccuracy(){
    entries++;
    const pos = typed.length-1;
    if(typed[pos] != lessonText[pos])
        totalErrors++;
    accuracy = (((entries - totalErrors) / entries) * 100);
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    document.removeEventListener("keydown", type);
    resetButton.blur();
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
        start = Date.now();
        interval = window.setInterval(timer, 250);
        langSelect.disabled = true;
        type(keydownEvent);
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} keydownEvent the keydownEvent 
 */
function type(keydownEvent) {
    const key = keydownEvent.key;
    let input = true;
    switch (key) {
        case "Tab":
            keydownEvent.preventDefault();
            typed.push('\t');
            break;
        case "Backspace":
            typed.pop();
            input = false;
            if (lessonText[typed.length] == '\n'){
                newlinecount--;
                toTypeBox.scrollBy(0, -lineHeight);
            }
            break;
        case "Enter":
            typed.push('\n');
            break;
        case " ":
            keydownEvent.preventDefault();
            typed.push(' ');
            break;
        default:
            if (keydownEvent.key.length == 1) 
                typed.push(keydownEvent.key);
            else //unsupported key
                return;
    }
    if (input) {
        //new entry
        updateAccuracy();
        if (lessonText[typed.length-1] == '\n' && ++newlinecount > 2)
            toTypeBox.scrollBy(0, lineHeight);
    }
    makeText(); 
}

/**
 * makeText - creates representation of text typed 
 *              so far w/ HTML formatting/colors
 */
function makeText() {
    let text = ''; //typed portion
    let ref = ''; //reference portion
    let i;

    //create typed portion
    errors = 0;
    for (i = 0; i < typed.length; i++) {
        let c = typed[i], c2 = lessonText[i];
        let correct = (c == c2);
        c = convertReserved(c);

        if (!correct) {
            errors++;
            c = convertInvis(c);
            if(c2 == '\n' || c2 == '\t')
                c+=c2;
            c = `<mark>${convertInvis(c)}</mark>`; //highlights error
            //if(c2 == '\n' || c2 == '\t')
              //  c+=c2;
        }
        text += c;
    }
    text = `<b>${text}</b>`

    //underline next char
    if (i < lessonText.length) {
        let c = lessonText[i++];
        let nextChar = convertReserved(c);
        ref = `<u>${convertInvis(nextChar)}</u>`;
        if(c == '\n' || c == '\t')
                ref += c;
    }

    //create reference portion
    while (i < lessonText.length) {
        ref += convertReserved(lessonText[i++]);
    }
    ref = `<span style="color:gray">${ref}</span>`;

    //displays updated text, checks for lesson completion
    toType.innerHTML = text + ref;
    updateStats();
    if (typed.length == lessonText.length)
        endLesson();
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
 * convertInvis - converts nonvisible characters to a corresponding visible character,
 *                  removing any associated functionality in the process.
 *                  Visible characters are left unchanged.
 * @param {*} c The character to convert.
 * @returns The converted character if nonvisible, the character itself otherwise.
 */
function convertInvis(c) {
    switch (c) {
        case '\n':
            c = '&#8629;'; //carrage return symbol
            break;
        case '\t':
            c = '&#8594;'; //right arrow symbol
            break;
    }
    return c;
}

/**
 * endLesson - sets lesson to completed state
 */
function endLesson() {
    end = Date.now();
    clearInterval(interval);
    document.removeEventListener("keydown", type);
    time = (end - start) / 1000;
    langSelect.disabled = false;
    alert(stats.textContent);
}
