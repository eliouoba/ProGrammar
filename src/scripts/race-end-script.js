import { auth, database } from './firebaseInit';
import { ref, set, get, onValue } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';

let backButton = document.getElementById("back");
let roomHeader = document.getElementById("room_header");
let container = document.getElementById("container");
let currentRoom = sessionStorage.getItem("room");
roomHeader.innerHTML = currentRoom;

backButton.addEventListener("click", () => window.location= 'gaming.html');
updateRoom();
let user;

function updateRoom() {
    onAuthStateChanged(auth, (u) => {
        if (u) {
            user = u;

            let players = document.getElementById("players_list");
            let roomRef = ref(database, `rooms/${currentRoom}/players`);
            players.innerHTML = "";
            get(roomRef).then((snapshot) => {
                let size = snapshot.size;
                snapshot.forEach((child) => {
                    let userRef = ref(database, `rooms/${currentRoom}/players/${child.key}/score`);
                    onValue(userRef, async (snapshot) => {
                        if(snapshot.exists()){
                            const player = document.createElement("p");
                            player.innerHTML = `${child.child("name").val()}: ${snapshot.val()}`;
                            players.appendChild(player);

                            if(players.childElementCount == size)
                                awardWinner();
                        }
                    });
                })
            });
        }
    });  
}

function awardWinner(){
    let roomRef = ref(database, `rooms/${currentRoom}/players`);
    get(roomRef).then((snapshot) => {
        let winner = null;;
        let best = null;
        snapshot.forEach((child) => {
            let score = child.child("score").val();
            if(best == null || score > best){
                best = score;
                winner = child;
            }
        })
        if(auth.currentUser.uid == winner.key){
            const winnerRef = ref(database, `stats/users/${winner.key}/won`);
            get(winnerRef).then((snapshot) => {
                let newWon = snapshot.val() + 1;
                set(winnerRef, newWon);
            });
        }
        alert(`The results are in: ${winner.child("name").val()} has won!`);
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