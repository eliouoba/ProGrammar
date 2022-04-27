import { getAuth, signOut } from 'firebase/auth';
require('./firebaseInit');

const signoutButton = document.getElementById("signoutButton");
signoutButton.addEventListener("click", logOut);

async function logOut() {
    let auth = getAuth();
    if (auth.currentUser == null)         
        alert("You're not logged in!");
    else {
        await signOut(auth);
        alert("Logged out!");
        setTimeout(window.location.reload(), 1500);
    }
}