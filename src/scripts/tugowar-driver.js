//Josiah Hsu

//quick element references
const loadDest = document.getElementById("toType");
const langSelect = document.getElementById("lang");
const defaultOption = document.getElementById("defaultOption");
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");

let interval, start, end; //timer
let bot;
let typer = new TugOWarInput();
let tugbot = new Tugbot();

//determine language from URL
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get("lang");

//load language's keywords into wordlist
const httpx = new XMLHttpRequest();
httpx.open("GET", `../files/keywords/keywords_${lang}.txt`);
httpx.onreadystatechange = function() {
    if (httpx.readyState == 4) {
        if (httpx.status == 200){
            typer.wordlist = httpx.responseText.replace(/\r/g, '').split("\n");
            resetButton.hidden = false;
            typer.init();
        }
        else if (httpx.status == 404)
            toType.textContent = "ERROR: The language you selected could not be found.";
    }
};
httpx.send();

//set default option for langSelect
const options = langSelect.options;
for(var i = 0; i < options.length; i++){
    if(options[i].value == lang){
        defaultOption.textContent = options[i].text;
    }
}

/**
 * changeLanguage - changes programming language and reloads page
 */
function changeLanguage() {
    const newLang = langSelect.value;
    if(newLang != lang){
        let url = window.location.href;
        url = `tugowar.html?&lang=${newLang}`;
        window.location = url;
    }
}

/**
 * setConfigDisabled - enables/disables config options 
 * @param {*} disable true to disable, false to enable
 */
function setConfigDisabled(disable){
    document.getElementById("setwpm").disabled = disable;
    document.getElementById("setacc").disabled = disable;
    langSelect.disabled = disable;
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    resetButton.blur();
    window.clearInterval(interval);
    window.clearInterval(bot);
    document.removeEventListener("keydown", type);
    document.addEventListener("keydown", initType);
    setConfigDisabled(false);
    typer.init();
}

/**
 * timer - keeps track of the time and wpm
 */
function timer() {
    typer.time = (Date.now() - start) / 1000;
    typer.updateWPM();
    typer.displayStats();
}

/**
 * botType - enters bot input
 */
function botType() {
    if(typer.checkEnd())
        endGame();
    else
        tugbot.botInput();
}

/**
 * initType - special event for first input
 * @param {*} keydownEvent the first key entered
 */
function initType(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", initType);
        document.addEventListener("keydown", type);
        start = Date.now();
        interval = window.setInterval(timer, 250);
        setConfigDisabled(true);
        typer.input(keydownEvent.key);

        const chars_per_sec = (tugbot.wpm * 5) / 60;
        bot = window.setInterval(botType, 1000/chars_per_sec);
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} key the key entered
 */
function type(keydownEvent) {
    if(typer.checkEnd())
        endGame();
    else{
        const key = keydownEvent.key;
        if(key == "Tab" || key == " ")
            keydownEvent.preventDefault();
        typer.input(keydownEvent.key);
    }
}

/**
 * endLesson - sets lesson to completed state
 */
function endGame() {
    end = Date.now();
    window.clearInterval(interval);
    window.clearInterval(bot);
    document.removeEventListener("keydown", type);
    setConfigDisabled(false);
    typer.time = (end - start) / 1000;
    typer.updateWPM();
    typer.displayStats();
    const str =  typer.score.value==0? 'win':'lose';
    alert(`Game over. You ${str}!`);
}

document.addEventListener("keydown", initType);