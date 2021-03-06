import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from "firebase/database";


import { auth, database } from './firebaseInit';

if (window.location.href.includes("user")) {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {
    const lessonsLabel = document.getElementById("lessons");
    const topicsLabel = document.getElementById("topics");
    const playedLabel = document.getElementById("played");
    const wonLabel = document.getElementById("won");
    const wpmLabel = document.getElementById("wpm");
    const accLabel = document.getElementById("acc");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            showStats(database, user);
        } else {
            const statsPanel = document.getElementById("stats-panel");
            statsPanel.innerHTML = `Log in to view stats`;
        }
    });
    
    //read from database and update html
    function showStats() {
        const user = auth.currentUser;
        const statsReference = ref(database, `stats/users/${user.uid}`);
        get(statsReference).then((snapshot) => {
            if (snapshot.exists()) {
                const stats = snapshot.val();
                lessonsLabel.innerHTML = `Lessons played: ${stats.lessons}`;
                topicsLabel.innerHTML = `Topics completed: ${stats.topics}`;
                playedLabel.innerHTML = `Games played: ${stats.played}`;
                wonLabel.innerHTML = `Games won: ${stats.won}`;
                wpmLabel.innerHTML = `Average WPM: ${stats.wpm}`;
                accLabel.innerHTML = `Average Accuracy: ${stats.acc}%`;
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        })
    }
}

let newBackground;
switch (localStorage.getItem('themeTextColor')) {
    case "navy":
    case "black":
        newBackground = "lightgray";
        break;
    case "red": 
        newBackground = "black";
        break;
    default:    //most light colors
        newBackground = "rgb(60,60,60)";
}
let panels = document.getElementsByClassName("stats");

for (const panel of panels) {
    panel.style.backgroundColor = newBackground;
    if(localStorage.getItem('video theme')) 
        panel.style.opacity = "90%";
    else panel.style.opacity = "100%";
}