import { auth, database } from './firebaseInit';
import { ref, set, get, onValue, remove } from "firebase/database";
import { onAuthStateChanged, d } from 'firebase/auth';
import {lessons, getExtOpts} from './lessonsRef';

let startButton = document.getElementById("start");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let name = sessionStorage.getItem("room");
roomHeader.innerHTML = name;
if (sessionStorage.getItem("creator") == "false") 
    document.getElementById("start").style.display = 'none';
startButton.addEventListener("click", () => startGame(user));
let currentRoom;
let user;


updateRoom();
setRace();

function updateRoom() {
    onAuthStateChanged(auth, (u) => {
        if (u) {
            user = u;
            let roomRef = ref(database, `rooms/${name}/players`);
            onValue(roomRef, async (snapshot) => {
                let players = document.getElementById("players_list");
                players.innerHTML = "";
                for (let p of Object.values(snapshot.val())) {
                    const player = document.createElement("p");
                    player.innerHTML = p.name;
                    players.appendChild(player);
                }
                currentRoom = snapshot.val();

                if (currentRoom[user.uid].state == "racing"){
                    let time = 5
                    setInterval(function() {
                        if (time < 0) return;
                        document.getElementById("players_header").innerHTML = `Starting in ${time}...`;
                        time--;
                    }, 1000);
                    setTimeout(() => location.href= 'race.html', 6000);
                }
            });
        }
    });  
}

function setRace(){
    let len = lessons.length;
    const index = Math.floor(Math.random() * len);
    let ext = chooseExt(getExtOpts(index));
    let filePath = `${lessons[index]}.${ext}`;
    let fileRef = ref(database, `rooms/${name}/gameFile`);
    set(fileRef, filePath);
}

function chooseExt(opts){
    let extOpts = opts.split("");
    const index = Math.floor(Math.random() * extOpts.length);
    return optToExt(extOpts[index]);
}

function optToExt(opt){
    switch(opt){
        case 'j': return 'java';
        case 'p': return 'py';
        case 'c': return 'c';
        case 'h': return 'html';
        case 's': return 'js';
    }
}

function startGame(user) {
    let size = Object.keys(currentRoom).length;
    if (size < 2) {
        alert("Not enough users.");
        return;
    }
    let roomRef = ref(database, `rooms/${name}/players`);

    get(roomRef).then((snapshot) => {
        snapshot.forEach((child) => {
            if(child.key != user.uid){
                let state = ref(database, `rooms/${name}/players/${child.key}/state`);
                set(state, "racing");
            }
        });
        set(ref(database, `rooms/${name}/players/${user.uid}/state`), "racing");
    });
}

//a race condition with theme.js setting local storage 
    //after this accesses it
setTimeout(() => { 
    switch (localStorage.getItem('themeTextColor')) {
        case "navy":
            container.style.backgroundColor = "lightgray";
            container.style.boxShadow = "0px 1px 3px gray";
            break;
        case "black":
            container.style.backgroundColor = "white";
            container.style.boxShadow = "0px 1px 3px gray";
            break;
        case "red": 
            container.style.backgroundColor = "black";
            container.style.boxShadow = "0px 1px 3px black";
            break;
        default:    //most light colors
            container.style.backgroundColor = "rgb(60,60,60)";
            container.style.boxShadow = "0px 1px 3px black";
    }
}, 500);