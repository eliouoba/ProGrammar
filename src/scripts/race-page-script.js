import { auth, database } from './firebaseInit';
import { remove, ref, set, get, child } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';

let button = document.getElementById("button");
let box = document.getElementById("box");

button.addEventListener("click", () => initializeRoom(box.value));

let user;
clearOldRooms();

onAuthStateChanged(auth, (u) => {
    if (u) {
        document.getElementById("login").style.display = "none";
        user = u;
    } else {
        document.getElementById("play").style.display = "none";
        document.getElementById("login").style.display = "flex";
    }
});

async function initializeRoom(name) {
    if (name.length < 4) {
        alert("Please enter a name of at least 4 characters")
        return;
    }
    let roomRef = ref(database, `rooms/${name}/players`);
    
    await get(roomRef).then((snapshot) => {
        let data = snapshot.val();
        if (data == null) {
            sessionStorage.setItem("creator", "true");
        } else {
            if (Object.keys(data).length >= 4
            && !(data[user.uid].name == user.displayName)) {
                alert("Sorry. This room is full.");
                return;
            }
            sessionStorage.setItem("creator", "false");
        }
        if (sessionStorage.getItem("creator") == "true")
            set(ref(database, `rooms/${name}`), { date: `${Date.now()}`});
        let userRef = ref(database, `rooms/${name}/players/${auth.currentUser.uid}`);
        set(userRef, { name: auth.currentUser.displayName});
        let stats = child(userRef, "liveStats");
        set(stats, { speed: 0, accuracy: 0 });
        let state = child(userRef, "state");
        set(state, "lobby"); 
    }).catch((error) => {
        console.error(error);
    });
    sessionStorage.setItem("room", name);
    window.location= 'raceLobby.html';
}

/** Deletes rooms more than an hour old. Important in case users never
 * start the game, so the room needs to be deleted at some point.
 * Here, every time a user goes to play race, the old rooms will be deleted. Might be a more efficient way to do this.
 */
 function clearOldRooms() {
    const ONE_HOUR = 60 * 60 * 1000; //in ms
    let rooms = ref(database, `rooms`);
    get(rooms).then((snapshot) => {
        let data = snapshot.val();
        if (data == null) return;
        for (let [roomName, room] of Object.entries(data)) {
            if (((Date.now()) - room.date) > ONE_HOUR)
                remove(ref(database, `rooms/${roomName}`));
        }
    }).catch((error) => {
        console.error(error);
    });
}