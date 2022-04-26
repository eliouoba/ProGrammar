import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

 /* Initializing Firebase */
 const firebaseConfig = {
    apiKey: "AIzaSyC8TjMHSCAqxaqlIW2MNdbWWLp_vyWUBHA",
    authDomain: "programmar-d33e8.firebaseapp.com",
    databaseURL: "https://programmar-d33e8-default-rtdb.firebaseio.com",
    projectId: "programmar-d33e8",
    storageBucket: "programmar-d33e8.appspot.com",
    messagingSenderId: "1017841820021",
    appId: "1:1017841820021:web:943e79503ad7292bb6b33c",
    measurementId: "G-6QTSB873J8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//a weird way of doing this but action events weren't firing
document.body.onload = ()=> {
    const signoutButton = document.getElementById("signoutButton");
    signoutButton.addEventListener("click", logOut);
}

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