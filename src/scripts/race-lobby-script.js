import { auth, database } from './firebaseInit';
import { ref, set, get, onValue, remove } from "firebase/database";
import { onAuthStateChanged, d } from 'firebase/auth';
let startButton = document.getElementById("start");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let name = sessionStorage.getItem("room");
roomHeader.innerHTML = name;
if (!sessionStorage.getItem("creator")) startButton.style.display = "none";
startButton.addEventListener("click", () => startGame());

updateRoom();
let currentRoom;

function updateRoom() {
    let roomRef = ref(database, `rooms/${name}/players`);
    onValue(roomRef, (snapshot) => {
        let players = document.getElementById("players_list");
        players.innerHTML = "";
        for (let p of Object.values(snapshot.val())) {
            const player = document.createElement("p");
            player.innerHTML = p.name;
            players.appendChild(player);
        }
        currentRoom = snapshot.val();
    });
}

function startGame() {
    let size = Object.keys(currentRoom).length;
    if (size < 2) {
        alert("Not enough users.");
        return;
    }
    location.href= 'race.html';
}

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

