import { auth, database } from './firebaseInit';
import { ref, set, get, child } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';

let button = document.getElementById("button");
let box = document.getElementById("box");

button.addEventListener("click", () => initializeRoom(box.value));

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("login").style.display = "none";
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
        if (Object.keys(snapshot.val()).length >= 4) {
            alert("Sorry. this room is full.");
            return;
        }
        console.log(snapshot.val().size());
        sessionStorage.setItem("creator", snapshot.val() == null);
        let userRef = ref(database, `rooms/${name}/players/${auth.currentUser.uid}`);
        set(userRef, { name: auth.currentUser.displayName});
        let newRef = child(userRef, "liveStats");
        set(newRef, { speed: 0, accuracy: 0 });
    }).catch((error) => {
        console.error(error);
    });
    sessionStorage.setItem("room", name);
    //location.href= 'raceLobby.html';
}