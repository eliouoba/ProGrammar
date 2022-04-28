import { auth, database } from './firebaseInit';
import { ref, set, get, remove } from "firebase/database";
import { onAuthStateChanged, d } from 'firebase/auth';
let startButton = document.getElementById("start");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let name = sessionStorage.getItem("room");
let currentRoom;
roomHeader.innerHTML = name;
if (!sessionStorage.getItem("creator")) startButton.style.display = "none";
startButton.addEventListener("click", () => startGame());

setInterval(()=> updateRoom(), 1000);

function updateRoom() {
    let roomRef = ref(database, `rooms/${name}/players`);
    get(roomRef).then((snapshot) => {
        //can't find an easier way to compare Javascript objects
        if (JSON.stringify(snapshot.val()) != JSON.stringify(currentRoom)) {
            for (let player of Object.values(snapshot.val())) {
                const p = document.createElement("p");
                p.innerHTML = player.name;
                document.getElementById("players_header").after(p); //insert after
            }
        }
        currentRoom = snapshot.val();
    }).catch((error) => {
        console.error(error);
    })
}

function startGame() {
    let size = currentRoom.size;
    console.log(size);
    if (size < 2) {
        alert("Not enough users.");
        return;
    }
    if (size > 4) {
        alert("Too many users");
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

