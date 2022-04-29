//Josiah Hsu

/* Initializing Firebase */
import { ref, get, set } from "firebase/database";
import Input from "./Input-Class.js";

import { auth, database } from './firebaseInit';
import { onAuthStateChanged } from "firebase/auth";

//quick element references
const toType = document.getElementById("toType");

let interval, start, end; //timer
let typer = new Input();
let name = sessionStorage.getItem("room");
let user;

onAuthStateChanged(auth, (u) => { if (u) user = u; });  

loadLesson();

/**
 * loadLesson - loads a lesson based on the URL parameter
 *              and the currently selected language
 */
function loadLesson(){
    const httpx = new XMLHttpRequest();

    let roomName = sessionStorage.getItem('room');
    let fileRef = ref(database, `rooms/${roomName}/gameFile`);

    get(fileRef).then((snapshot) => {
        httpx.open("GET", `../files/${snapshot.val()}`);
        httpx.onreadystatechange = function() {
            if (httpx.readyState == 4) {
                if (httpx.status == 200){
                    typer.toTypeText = httpx.responseText.replace(/    /g, "\t").replace(/\r/g, '');
                    init();
                }
                else if (httpx.status == 404)
                    toType.textContent = "ERROR: The lesson you selected could not be found.";
            }
        };
        httpx.send();
    })
}

/**
 * init - sets to initial state
 */
function init() {
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
 * startLesson - special event for first input
 * @param {*} keydownEvent the first key entered
 */
function startLesson(keydownEvent) {
    if (keydownEvent.key.length == 1) {
        document.removeEventListener("keydown", startLesson);
        document.addEventListener("keydown", type);
        start = Date.now();
        interval = window.setInterval(timer, 1000);
        typer.input(keydownEvent.key);
    }
    //endLesson();
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
    typer.time = (end - start) / 1000;
    typer.updateWPM();
    typer.displayStats();

    let state = ref(database, `rooms/${name}/players/${user.uid}/state`);
        set(state, "complete");

    updateUserStats();
    document.getElementById("stats").style.color="red";
    let time = 3;
    setInterval(function() {
        if (time < 0) return;
        document.getElementById("count").innerHTML = `${time}...`;
        time--;
    }, 1000);
    setTimeout(() => location.href= 'raceEnd.html', 4000);
}

/**
 * updateUserStats - calculates new stats for user and updates database accordingly
 */
function updateUserStats(){
    if(auth.currentUser == null) return;
    let sts = typer.getStats();
    const user = auth.currentUser.uid;
    const statsReference = ref(database, `stats/users/${user}`);
    get(statsReference).then((snapshot) => {
        const stats = snapshot.val();
        //for calculating average
        let prevTotal = stats.lessons+stats.played;
        let newTotal = prevTotal + 1;

        let newPlayed = stats.played + 1;
        let newAccuracy = ((stats.acc * prevTotal) + sts[3])/newTotal;
        newAccuracy = Number(newAccuracy.toFixed(2)); 
        let newWPM = ((stats.wpm * prevTotal) +sts[2])/newTotal; 
        newWPM = Math.round(newWPM);
        set(ref(database, `stats/users/${user}/played`), newPlayed);
        set(ref(database, `stats/users/${user}/acc`), newAccuracy);
        set(ref(database, `stats/users/${user}/wpm`), newWPM);
    }).catch((error) => {
        console.error(error);
    });
}

document.addEventListener("keydown", startLesson);