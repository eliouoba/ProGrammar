//Josiah Hsu

import Input from "./Input-Class.js";

//quick element references
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const uploader = document.getElementById('uploader');
uploader.oninput=setText;
resetButton.onclick=reset;

let interval, start, end; //timer
let typer = new Input();

let allowed = ['java', 'c', 'py']; //defines allowed files - can expand list as needed

let allowedMsg = "Allowed file formats: ";
for(var i = 0; i < allowed.length; i++)
        allowedMsg += `${(i > 0?', ':'')}.${allowed[i]}`;
document.getElementById("help").innerHTML += allowedMsg;

const reader = new FileReader();

function setText(){
    console.log(uploader);
    let selectedFile = uploader.files[0];

    if(selectedFile == null) return;

    //check file extension to see if selected file is valid
    let extension = selectedFile.name.split('.').pop();
    if(!allowed.includes(extension)){
        alert(`Invalid input. Please use a supported file.\n${allowedMsg}`)
        return;
    }

    toType.textContent = reader.readAsText(selectedFile);
    reader.addEventListener("load", ()=>{
        typer.toTypeText = reader.result;
        typer.init();
        document.addEventListener("keydown", startLesson);
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
    document.addEventListener("keydown", startLesson);
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
function startLesson(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", startLesson);
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