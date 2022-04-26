//Josiah Hsu


import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set, update} from "firebase/database";

import Input from "./Input-Class.js";

const firebaseConfig = {
    apiKey: "AIzaSyC8TjMHSCAqxaqlIW2MNdbWWLp_vyWUBHA",
    authDomain: "programmar-d33e8.firebaseapp.com",
    databaseURL: "https://programmar-d33e8-default-rtdb.firebaseio.com",
    projectId: "programmar-d33e8",
    storageBucket: "programmar-d33e8.appspot.com",
    messagingSenderId: "1017841820021",
    appId: "1:1017841820021:web:943e79503ad7292bb6b33c",
    measurementId: "G-6QTSB873J8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

//quick element references
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const fileSelect = document.getElementById('fileSelect');
const uploader = document.getElementById('uploader');
const downloader = document.getElementById('downloader');
fileSelect.oninput=loadTextFromFile;
resetButton.onclick=reset;
uploader.onclick=saveLesson;
downloader.onclick=loadTextFromDB;

let interval, start, end; //timer
let typer = new Input();

let allowed = ['java', 'c', 'py']; //defines allowed files - can expand list as needed

let allowedMsg = "Allowed file formats: ";
for(var i = 0; i < allowed.length; i++)
        allowedMsg += `${(i > 0?', ':'')}.${allowed[i]}`;
document.getElementById("help").innerHTML += allowedMsg;

const reader = new FileReader();

/**
 * loadTextFromFile - loads a lesson from a user-provided file
 */
function loadTextFromFile(){
    let selectedFile = fileSelect.files[0];
    if(selectedFile == null) return;

    uploader.disabled = false;

    //check file extension to see if selected file is valid
    let extension = selectedFile.name.split('.').pop();
    if(!allowed.includes(extension)){
        alert(`Error: Invalid input. Please use a supported file.\n${allowedMsg}`)
        return;
    }

    toType.textContent = reader.readAsText(selectedFile);
    reader.addEventListener("load", reader.f = function fn(){
        setText(reader.result);    
        reader.removeEventListener("load", reader.f);
    }, false);
}

/**
 * setText - initializes the typer for this lesson text
 * @param {*} text 
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
    if(selectedFile == null) return;
    const user = auth.currentUser.uid;
    const lessonsReference = ref(database, `users/${user}/lessons`);
    get(lessonsReference).then((snapshot) => {
        let newLesson = typer.toTypeText;
        let name = promptName("Enter a name for your lesson.");
        if(name == null) return;
        if(snapshot.hasChild(name) && confirm(`Lesson '${name}' already exists. Overwrite?`))
            set(ref(database, `users/${user}/lessons/${name}`), newLesson);
    }).catch((error) => {
        console.error(error);
    });
}

/**
 * loadTextFromDB - loads a previously saved lesson (if it exists).
 */
function loadTextFromDB(){
    let name = promptName("Enter the name of a lesson you previously uploaded.");
    if(name == null) return;
    const user = auth.currentUser.uid;
    const lessonsReference = ref(database, `users/${user}/lessons`);
    get(lessonsReference).then((snapshot) => {
        if(snapshot.hasChild(name))
            setText(snapshot.child(name).val());
        else
            alert("Error: No such lesson exists.");
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
    uploader.disabled = disable;
    downloader.disabled = disable;
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
    alert(stats.textContent);
}