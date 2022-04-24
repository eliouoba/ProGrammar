//Josiah Hsu
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set} from "firebase/database";

import TugOWarInput from './TugOWar-Input-Class.js';
import Tugbot from './Tugbot-Class.js';

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
const langSelect = document.getElementById("lang");
const defaultOption = document.getElementById("defaultOption");
const resetButton = document.getElementById("reset");
const toType = document.getElementById("toType");
const setwpm = document.getElementById("setwpm");
const setacc = document.getElementById("setacc");

langSelect.onchange=changeLanguage;
resetButton.onclick = reset;
setwpm.onchange=()=>{tugbot.setwpm(setwpm.value)};
setacc.onchange=()=>{tugbot.setacc(setacc.value)};

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
    setwpm.disabled = disable;
    setacc.disabled = disable;
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

    let sts = typer.getStats();
    const user = auth.currentUser.uid;
    const statsReference = ref(database, `users/${user}/stats`);
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
        let newWins = stats.won + (typer.score.value==0? 1:0);
        set(ref(database, `users/${user}/stats/played`), newPlayed);
        set(ref(database, `users/${user}/stats/acc`), newAccuracy);
        set(ref(database, `users/${user}/stats/wpm`), newWPM);
        set(ref(database, `users/${user}/stats/won`), newWins);
    }).catch((error) => {
        console.error(error);
    });
}

document.addEventListener("keydown", initType);