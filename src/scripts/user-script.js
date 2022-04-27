import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, currentUser} from 'firebase/auth';
import { getDatabase, ref, get, set } from "firebase/database";

if (window.location.href.includes("user")) {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {
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
    const database = getDatabase(app);
    const auth = getAuth(app);

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
            incrementButton.style.display = "none";
        }
    });

    const incrementButton = document.getElementById("increment");
    incrementButton.addEventListener("click", increase);

    function increase() {
        const user = auth.currentUser.uid;
        const userStatsReference = ref(database, `users/${user}/stats`);
        get(userStatsReference).then((snapshot) => {
            //userReference
            let pathName = ["lessons", "topics", "played", "won", "wpm", "acc"];
            pathName.forEach((path)=>{
                let value = parseInt(snapshot.child(`${path}`).val());
                set(ref(database, `users/${user}/stats/${path}`), value + 1);
            });

            showStats();
        }).catch((error) => {
            console.error(error);
        });
        const statsReference = ref(database, `stats`);
        get(statsReference).then((snapshot) => {
            //statsReference
            //syntax: just "lessons[user]" not "lessons.[user]"
            let pathName = ["lessons", "topics", "played", "won", "wpm", "acc"];
            pathName.forEach((path)=>{
                let value = parseInt(snapshot.child(`${path}/${user}/value`).val());
                set(ref(database, `stats/${path}/${user}/value`), value + 1);
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    
    //read from database and update html
    function showStats() {
        const user = auth.currentUser;
        const statsReference = ref(database, `users/${user.uid}/stats`);
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
