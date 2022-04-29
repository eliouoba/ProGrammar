import { auth, database } from './firebaseInit';
import { ref, set, get, onValue, remove } from "firebase/database";
import { onAuthStateChanged, d } from 'firebase/auth';
let startButton = document.getElementById("start");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let name = sessionStorage.getItem("room");
roomHeader.innerHTML = name;
if (sessionStorage.getItem("creator") == "false") 
    document.getElementById("start").style.display = 'none';
startButton.addEventListener("click", () => startGame(user));
updateRoom();
let currentRoom;
let user;

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
                if (currentRoom[user.uid].state == "racing")
                    location.href= 'race.html';
            });
        }
    });  
}

function startGame(user) {
    let size = Object.keys(currentRoom).length;
    if (size < 2) {
        alert("Not enough users.");
        return;
    }
    let roomRef = ref(database, `rooms/${name}/players`);

    get(roomRef).then((snapshot) => {
        for (let player of Object.keys(snapshot.val())) {
            let state = ref(database, `rooms/${name}/players/${player}/state`);
            set(state, "racing");
            console.log
        }
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