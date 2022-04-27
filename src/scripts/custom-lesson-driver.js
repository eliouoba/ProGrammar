//Josiah Hsu

import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set} from "firebase/database";
import { auth, database } from './firebaseInit';

import Input from "./Input-Class.js";

//quick element references
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const fileSelect = document.getElementById('fileSelect');
const saveButton = document.getElementById('saveButton');
const loadMenu = document.getElementById('loadMenu');

fileSelect.oninput=loadTextFromFile;
resetButton.onclick=reset;
saveButton.onclick=saveLesson;
loadMenu.onchange=loadTextFromDB;

onAuthStateChanged(auth, (user) => {
    if (user) {
        initLessonList();
    } else {
        toType.innerHTML = "Log in to access custom lessons."
        setConfigDisabled(true);
    }
});

let interval, start, end; //timer
let typer = new Input();

//defines allowed files - can expand list as needed
let supportedFiles = ['java', 'c', 'py', 'js', "html", "css"];

let accept = '';
for(var i = 0; i < supportedFiles.length; i++)
        accept += `${(i > 0?', ':'')}.${supportedFiles[i]}`;
fileSelect.accept = accept; //restricts file select to the listed files

let acceptMsg = "Supported file formats: " + accept;
document.getElementById("toType").textContent += '\n' + acceptMsg;

const reader = new FileReader();

/**
 * initLessonList - retrieves list of lessons from database
 */
function initLessonList(){
    const user = auth.currentUser.uid;
    const lessonsReference = ref(database, `users/${user}/lessons`);
    get(lessonsReference).then((snapshot) => {
        snapshot.forEach((child)=>{
            appendLessonList(child.key);
        });
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * appendLessonList - appends a lesson to the end of the list
 * @param {*} name The name to add to the lesson list
 */
function appendLessonList(name){
    let l = document.createElement('option');
    l.value = name;
    l.textContent = name;
    loadMenu.appendChild(l);
}

/**
 * loadTextFromFile - loads a lesson from a user-provided file
 */
function loadTextFromFile(){
    let selectedFile = fileSelect.files[0];
    if(selectedFile == null) return;
    saveButton.disabled = false;
    document.getElementById("default").selected = true;
    //check file extension to see if selected file is valid
    let extension = selectedFile.name.split('.').pop();
    if(supportedFiles.includes(extension)){
        toType.textContent = reader.readAsText(selectedFile);
        reader.addEventListener("load", reader.f = function fn(){
            setText(reader.result);    
            reader.removeEventListener("load", reader.f);
        }, false);
    }
    else{
        alert(`Error: Invalid input. Please use a supported file.\n${acceptMsg}`)
    }
}

/**
 * setText - initializes the typer for this lesson text
 * @param {*} text The lesson text to use for this custom lesson
 */
function setText(text){
    typer.toTypeText = text;
    typer.init();
    document.addEventListener("keydown", startLesson);
    resetButton.hidden = false;
    fileSelect.blur();
}

/**
 * saveLesson - saves and uploads a lesson to the user's account
 */
function saveLesson(){
    let selectedFile = fileSelect.files[0];
    if(selectedFile == null) return

    const user = auth.currentUser.uid;
    const lessonsReference = ref(database, `users/${user}/lessons`);
    get(lessonsReference).then((snapshot) => {
        let newLesson = typer.toTypeText;
        let name = promptName("Enter a name for your lesson.");
        if(name == null) return;
        if(!snapshot.hasChild(name))
            appendLessonList(name);
        else if(!confirm(`Lesson '${name}' already exists. Overwrite?`))
            return;
        set(ref(database, `users/${user}/lessons/${name}`), newLesson);
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * loadTextFromDB - loads a previously saved lesson (if it exists).
 */
function loadTextFromDB(){
    const user = auth.currentUser.uid;
    const name = loadMenu.value;
    const lessonsReference = ref(database, `users/${user}/lessons`);
    get(lessonsReference).then((snapshot) => {
        setText(snapshot.child(name).val());
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * promptName - prompts the user to input a name, with an additional guard
 *              to prevent invalid characters.
 * @param {*} promptText The prompt to use
 * @returns the inputted name, or null if the user cancels the prompt
 */
function promptName(promptText){
    let name = prompt(promptText)
    while(name != null && /^$|\.|\#|\$|\[|\]/.test(name)){    
        name = prompt('Error: Invalid name.\nNames must be nonempty and cannot contain ".", "#", "$", "[", or "]".');
    }
    return name;
}

/**
 * reset - reset to initial state
 */
function reset() {
    alert("Resetting!");
    resetButton.blur();
    setConfigDisabled(false);
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
        setConfigDisabled(true);
        typer.input(keydownEvent.key);
    }
}

/**
 * setConfigDisabled - enables/disables interactable elements
 * @param {*} disable True if disabling elements, false if enabling them
 */
function setConfigDisabled(disable){
    fileSelect.disabled = disable;
    saveButton.disabled = disable;
    loadMenu.disabled = disable;
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
    setConfigDisabled(false);
}