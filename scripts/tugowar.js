//Josiah Hsu

//quick element references
const stats = document.getElementById("stats");
const toType = document.getElementById("toType");
const toTypeBox = document.getElementById("toTypeBox");
const score = document.getElementById("score");

//variables/constants
let gameText, typed, newlinecount, currentline; //input
let time, errors, netwpm, accuracy; //stats
let entries, totalErrors; //accuracy
let start, end, interval; //timer
let charset;

//turns out that this one line mandates that at least one script in the html be nondeferred.
const lineHeight = window.getComputedStyle(toTypeBox).lineHeight.replace("px", '');

initCharset();
init();

/**
 * initCharset - initializes selection of characters that
 *              will be used to generate stream
 */
function initCharset(){
    /**
     * this will likely change to keywords/phrases
     * in the future, but for initial testing
     * it's just random characters
     */
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '1234567890';
    charset = `${lowers}${uppers}${nums}`;
}

/**
 * generate - appends new line of text to gameText
 */
function generate(){
    const len = charset.length;
    for(var i = 0; i < 50; i++){
        const x = Math.floor(Math.random() * len);
        gameText += charset[x];
    }
    gameText+='\n';
    newlinecount++;
}

/**
 * init - sets initial state
 */
function init() {
    score.value = 50;
    entries = 0;
    totalErrors = 0;
    time = 0;
    errors = 0;
    netwpm = 0;
    accuracy = 100;
    currentline = 0;
    newlinecount = 0;
    gameText='';
    typed = [];
    for(var i = 0; i < 6; i++)
        generate();
    makeText();
    toTypeBox.scrollTo(0,0);
    document.addEventListener("keydown", initType);
    window.clearInterval(interval);
}

/**
 * timer - keeps track of the time and wpm
 */
function timer() {
    time = (Date.now() - start) / 1000;
    updateWPM();
    displayStats();
    checkEndGame();
}

/**
 * updateWPM - calculates user's net wpm
 */
function updateWPM(){
    const mins = time / 60;
    netwpm = ((typed.length / 5) - errors) / mins;
    netwpm = Math.round(netwpm);
}

/**
 * displayStats - displays wpm, errors, and time
 */
function displayStats() {
    stats.textContent = `Time: ${time.toFixed(2)} Errors: ${errors} ` +
                        `Net WPM: ${netwpm} Accuracy: ${accuracy.toFixed(2)}%`;
}

/**
 * updateAccuracy - calculates accuracy based on total entries/errors
 */
 function updateAccuracy(){
    entries++;
    let newScore = Number(score.value);
    const pos = typed.length-1;
    if(typed[pos] != gameText[pos]){
        //incorrect
        totalErrors++;
        newScore=Math.min(100, newScore+3);
    }
    else{
        //correct
        newScore=Math.max(0, newScore-1);
    }
    score.value = newScore;
    accuracy = ((entries - totalErrors) / entries) * 100;

    checkEndGame();
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
            const pos = typed.length-1;
            if(typed.pop() != gameText[pos]){
                //correcting mistake - removes penalty
                score.value = Number(score.value)-3
            }
            if (gameText[typed.length] == '\n'){
                currentline--;
                toTypeBox.scrollBy(0, -lineHeight);
            }
            input = false;
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
        if (gameText[typed.length-1] == '\n' && ++currentline > 2){
            toTypeBox.scrollBy(0, lineHeight);
            if(newlinecount - currentline == 3)
                generate();
        }
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
        let c = typed[i], c2 = gameText[i];
        let correct = (c == c2);
        c = convertReserved(c);

        if (!correct) {
            errors++;
            c = convertInvis(c);
            if(c2 == '\n' || c2 == '\t')
                c+=c2;
            c = `<mark>${convertInvis(c)}</mark>`; //highlights error
        }
        text += c;
    }
    text = `<b>${text}</b>`

    //outline next char
    if (i < gameText.length) {
        let c = gameText[i++];
        let nextChar = convertInvis(convertReserved(c));
        if(c == '\n' || c == '\t')
            nextChar+=c;
        ref = `<span style='border: 1px solid gray'>${nextChar}</span>`;
    }

    //create reference portion
    while (i < gameText.length) {
        ref += convertReserved(gameText[i++]);
    }
    ref = `<span style="color:gray">${ref}</span>`;

    //displays updated text, checks for game completion
    toType.innerHTML = text + ref;
    displayStats();
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
 * checkEndGame - sets game to completed state
 */
function checkEndGame() {
    const win = score.value == 0;
    const lose = score.value == 100;
    if(win || lose){
        end = Date.now();
        clearInterval(interval);
        document.removeEventListener("keydown", type);
        time = (end - start) / 1000;
        updateWPM();
        displayStats();
        const str =  win? 'win':'lose';
        alert(`Game over. You ${str}!`);
    }
}
