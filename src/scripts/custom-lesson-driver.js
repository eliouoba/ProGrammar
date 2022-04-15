//Josiah Hsu

//quick element references
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const nextLessonButton = document.getElementById("nextLesson");
const uploader = document.getElementById('uploader');

let interval, start, end; //timer
let typer = new Input();

const reader = new FileReader();

function setText(){
    let selectedFile = uploader.files[0];
    toType.textContent = reader.readAsText(selectedFile);
    reader.addEventListener("load", ()=>{
        typer.toTypeText = reader.result;
        typer.init();
        document.addEventListener("keydown", initType);
        resetButton.hidden = false;
        uploader.blur();
        reader.removeEventListener("load", this);
    }, false);
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    resetButton.blur();
    uploader.disabled = false;
    window.clearInterval(interval);
    document.removeEventListener("keydown", type);
    document.addEventListener("keydown", initType);
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
 * initType - special event for first input
 * @param {*} keydownEvent the first key entered
 */
function initType(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", initType);
        document.addEventListener("keydown", type);
        start = Date.now();
        interval = window.setInterval(timer, 250);
        uploader.disabled = true;
        typer.input(keydownEvent.key);
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} key the key entered
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
    typer.time = (end - start) / 1000;
    typer.updateWPM();
    typer.displayStats();
    uploader.disabled = false;
    alert(stats.textContent);
}