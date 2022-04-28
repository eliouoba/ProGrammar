//Josiah Hsu


/* Initializing Firebase */
import { ref, get, set} from "firebase/database";
import Input from "./Input-Class.js";

import { auth, database } from './firebaseInit';

//quick element references
const langSelect = document.getElementById("lang");
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const nextLessonButton = document.getElementById("nextLesson");
const twitter = document.getElementById("twitter");

langSelect.onchange=loadLesson;
resetButton.onclick=init;
nextLessonButton.onclick=getNextLesson;

let interval, start, end; //timer
let typer = new Input();

const lessons = ["HelloWorld", "Integers", "BasicMath", "Strings", 
"Concatenation", "IfStatements", "WhileLoops", "ForLoops", "PrintArray",
"Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap", "Linear", "Binary"];

//determine lesson from url
const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
const extension = urlParams.get("lang");

//checks which languages are available for this lesson
const options = ['j', 'p', 'c'];
for(let i = options.length-1; i >= 0; i--){
    if(!extension.includes(options[i]))
        langSelect.options[i].remove();
}

if(langSelect.options.length == 0){
    //no valid language for selected lesson
    toType.textContent = "ERROR: The lesson you selected could not be found.";
    langSelect.remove();
    document.getElementById("langLabel").remove();
}
else{
    //set default option for langSelect
    langSelect.value = langSelect.options[0].value;
    loadLesson();
}

//map between extension and language
const langs = new Map();
langs.set('java', 'Java');
langs.set('py', 'Python');
langs.set('c', 'C');

/**
 * loadLesson - loads a lesson based on the URL parameter
 *              and the currently selected language
 */
function loadLesson(){
    const httpx = new XMLHttpRequest();
    httpx.open("GET", `../files/${lessonFile}.${langSelect.value}`);
    httpx.onreadystatechange = function() {
        if (httpx.readyState == 4) {
            if (httpx.status == 200){
                typer.toTypeText = httpx.responseText.replace(/    /g, "\t").replace(/\r/g, '');
                resetButton.hidden = false;
                nextLessonButton.hidden = true;
                init();
            }
            else if (httpx.status == 404)
                toType.textContent = "ERROR: The lesson you selected could not be found.";
        }
    };
    httpx.send();
}

/**
 * init - sets to initial state
 */
function init() {
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
        interval = window.setInterval(timer, 1000);
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
    nextLessonButton.hidden = false;
    twitter.hidden = false;

    let sts = typer.getStats();
    let tweet = "https://twitter.com/intent/tweet?text=";
    tweet += `I just completed the ${lessonFile} ${langs.get(langSelect.value)} lesson in ProGrammar!`;
    tweet += `%0aTime: ${sts[0]}%0aErrors: ${sts[1]}%0aNet WPM: ${sts[2]}%0aAccuracy: ${sts[3]}%25`
    twitter.href = tweet;

    updateUserStats();
}

function updateUserStats(){
    if(auth.currentUser == null) return;
    const user = auth.currentUser.uid;
    const statsReference = ref(database, `users/${user}/stats`);
    get(statsReference).then((snapshot) => {
        const stats = snapshot.val();
        //for calculating average
        let prevTotal = stats.lessons+stats.played;
        let newTotal = prevTotal + 1;

        let newLessons = stats.lessons + 1;
        let newAccuracy = ((stats.acc * prevTotal) + sts[3])/newTotal;
        newAccuracy = Number(newAccuracy.toFixed(2)); 
        let newWPM = ((stats.wpm * prevTotal) +sts[2])/newTotal; 
        newWPM = Math.round(newWPM);
        set(ref(database, `users/${user}/stats/lessons`), newLessons);
        set(ref(database, `users/${user}/stats/acc`), newAccuracy);
        set(ref(database, `users/${user}/stats/wpm`), newWPM);
    }).catch((error) => {
        console.error(error);
    });
}

function getNextLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) + 1;
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

document.addEventListener("keydown", startLesson);