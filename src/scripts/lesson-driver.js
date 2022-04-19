//Josiah Hsu

//quick element references
const langSelect = document.getElementById("lang");
const defaultOption = document.getElementById("defaultOption");
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const nextLessonButton = document.getElementById("nextLesson");
const twitter = document.getElementById("twitter");

let interval, start, end; //timer
let typer = new Input();

const lessons = ["HelloWorld", "Integers", "BasicMath", "Strings", "Concatenation", "IfStatements", "WhileLoops", "ForLoops"];

//determine lesson from url
const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
const extension = urlParams.get("lang");

//set default option for langSelect
const options = langSelect.options;
for(var i = 0; i < options.length; i++){
    if(options[i].value == extension){
        defaultOption.textContent = options[i].text;
    }
};

/**
 * loadLesson - loads a lesson based on URL parameters
 */
function loadLesson(){
    httpx = new XMLHttpRequest();
    httpx.open("GET", `../files/${lessonFile}.${extension}`);
    httpx.onreadystatechange = function() {
        if (httpx.readyState == 4) {
            if (httpx.status == 200){
                typer.toTypeText = httpx.responseText.replace(/    /g, "\t").replace(/\r/g, '');
                resetButton.hidden = false;
                nextLessonButton.hidden = true;
                typer.init();
            }
            else if (httpx.status == 404)
                toType.textContent = "ERROR: The lesson you selected could not be found.";
        }
    };
    httpx.send();
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
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    resetButton.blur();
    window.clearInterval(interval);
    document.removeEventListener("keydown", type);
    document.addEventListener("keydown", startLesson);
    langSelect.disabled = false;
    twitter.hidden = true;
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
 * startLesson - special event for first input
 * @param {*} keydownEvent the first key entered
 */
function startLesson(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", startLesson);
        document.addEventListener("keydown", type);
        start = Date.now();
        interval = window.setInterval(timer, 250);
        langSelect.disabled = true;
        typer.input(keydownEvent.key);
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} keydownEvent the key entered
 */
function type(keydownEvent) {
    const key = keydownEvent.key;
    if(key == "Tab" || key == " ")
        keydownEvent.preventDefault();
    typer.input(keydownEvent.key);
    if(typer.checkEnd())
        endLesson();
}

/**
 * endLesson - sets lesson to completed state
 */
function endLesson() {
    end = Date.now();
    window.clearInterval(interval);
    document.removeEventListener("keydown", type);
    langSelect.disabled = false;
    typer.time = (end - start) / 1000;
    typer.updateWPM();
    typer.displayStats();
    alert(document.getElementById("stats").textContent);
    nextLessonButton.hidden = false;
    twitter.hidden = false;

    let sts = typer.getStats();
    let tweet = "https://twitter.com/intent/tweet?text=";
    tweet += `I just completed the ${lessonFile} ${defaultOption.textContent} lesson in ProGrammar!`;
    tweet += `%0aTime: ${sts[0]}%0aErrors: ${sts[1]}%0aNet WPM: ${sts[2]}%0aAccuracy: ${sts[3]}%25`
    twitter.href = tweet;
}

function getNextLesson() {
    n = lessons.findIndex((element) => element == lessonFile) + 1;
    if (n <= lessons.length)
        selectLesson(lessons[n], extension);
    else
        alert("Sorry, that lesson doesn't exist yet...");
}

function selectLesson(lesson, lang) {
    let url = window.location.href;
    url = `lesson.html?lesson=${lesson}&lang=${lang}`;
    window.location = url;
}

loadLesson();
document.addEventListener("keydown", startLesson);