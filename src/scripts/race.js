//Josiah Hsu

/* Initializing Firebase */
import { ref, get, set, onValue } from "firebase/database";
import Input from "./Input-Class.js";

import { auth, database } from './firebaseInit';

//quick element references
const toType = document.getElementById("toType");

let interval, start, end; //timer
let typer = new Input();

let roomName = sessionStorage.getItem('room');

loadLesson();

/**
 * loadLesson - loads a lesson based on the URL parameter
 *              and the currently selected language
 */
function loadLesson(){
    const httpx = new XMLHttpRequest();
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
    let fileRef = ref(database, `rooms/${roomName}/players`);
    get(fileRef).then((snapshot) => {
        let tracks = document.getElementsByClassName("track");
        let i = 0;
        snapshot.forEach((child) => {
            if(child != null){
                document.getElementById(`p${i+1}`).innerHTML = child.child("name").val();
                tracks[i].id = child.key;
                i++;
            }
        });
        let roomRef = ref(database, `rooms/${roomName}/players`);
        onValue(roomRef, async (snapshot) => {
            snapshot.forEach((child)=>{
                if(child != null)
                    document.getElementById(child.key).value = child.child("progress").val();
            });
        });
    });
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
    let progress = (typer.typed.length / typer.toTypeText.length) * 100;
    progress = parseInt(progress);

    let userRef = ref(database, `rooms/${roomName}/players/${auth.currentUser.uid}/progress`)
    set(userRef, progress);
    
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

    let userRef = ref(database, `rooms/${roomName}/players`);
    get(userRef).then((snapshot)=>{
        let won = true;
        snapshot.forEach((child) =>{
            if(child.child("state").val() == "completed"){
                won = false;
            }
            if(child.key == auth.currentUser.uid){
                set(ref(database, `rooms/${roomName}/players/${auth.currentUser.uid}/state`), "completed");
            }
        })
        if(won){
            alert("You win!")    
        }
        updateUserStats(won);
    })
}

/**
 * updateUserStats - calculates new stats for user and updates database accordingly
 */
function updateUserStats(win){
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
        let newWon = stats.won + win? 1 : 0;
        set(ref(database, `stats/users/${user}/played`), newPlayed);
        set(ref(database, `stats/users/${user}/acc`), newAccuracy);
        set(ref(database, `stats/users/${user}/wpm`), newWPM);
        set(ref(database, `stats/users/${user}/won`), newWon);
    }).catch((error) => {
        console.error(error);
    });
}

document.addEventListener("keydown", startLesson);