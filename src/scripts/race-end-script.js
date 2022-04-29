import { auth, database } from './firebaseInit';
import { ref, set, get, onValue, remove } from "firebase/database";
import { onAuthStateChanged, } from 'firebase/auth';

let backButton = document.getElementById("back");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let currentRoom = sessionStorage.getItem("room");
roomHeader.innerHTML = currentRoom;

backButton.addEventListener("click", () => window.location= 'gaming.html');
updateResults();
let user;

async function updateResults() {
    await onAuthStateChanged(auth, (u) => { if (u) user = u; });  
    
    let resultsRef = ref(database, `rooms/${currentRoom}/results`)
    let roomRef = ref(database, `rooms/${currentRoom}/players`);
    
    //show the standings
    onValue(resultsRef, async (snapshot) => {   
        console.log("called");
        get(resultsRef).then((snapshot) => {
            let players = document.getElementById("players_list");
            players.innerHTML = "";
            for (let [place, p] of Object.entries(snapshot.val())) {
                const player = document.createElement("p");
                let n = parseInt(place) + parseInt(1);
                let t = n + " place: " + p;
                player.innerHTML = t;
                players.appendChild(player);
            }
        }).catch((error) => {
            console.error(error);
        });
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