import { auth, database } from './firebaseInit';
import { ref, set, remove } from "firebase/database";
import Room from "./Room";

let createButton = document.getElementById("create_button");
let joinButton = document.getElementById("join_button");
let createBox = document.getElementById("create_box");
let joinBox = document.getElementById("join_box");

createButton.addEventListener("click", createRoom(createBox.value));
joinButton.addEventListener("click", joinRoom(joinBox.value));


let room;

function createRoom(name) {
    room = new Room(name);
    console.log("hey");
}

function joinRoom(name) {

}
