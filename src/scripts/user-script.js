import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, child, onValue, on } from "firebase/database";
console.log("user script called");

if (window.location.href.includes("user"))
    document.addEventListener("DOMContentLoaded", setup);

function setup() {
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

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);
    const auth = getAuth(app);

    const lessons = document.getElementById("lessons");
    const topics = document.getElementById("topics");
    const played = document.getElementById("played");
    const won = document.getElementById("won");
    const wpm = document.getElementById("wpm");
    const acc = document.getElementById("acc");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("current user: " + user.uid);
            showStats(database, user);
        } else {
            const statsPanel = document.getElementById("stats-panel");
            statsPanel.innerHTML = `Login to view stats`;
        }
    });
}  
        
//read from database and update html
function showStats(database, user) {
    const statsReference = ref(database, `users/${user.uid}/stats`);
    get(statsReference).then((snapshot) => {
        if (snapshot.exists()) {
            const stats = snapshot.val();
            lessons.innerHTML += stats.lessons;
            topics.innerHTML += stats.topics;
            played.innerHTML += stats.played;
            won.innerHTML += stats.won;
            wpm.innerHTML += stats.wpm;
            acc.innerHTML += stats.acc;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    })
}