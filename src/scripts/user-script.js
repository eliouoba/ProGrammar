import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, set } from "firebase/database";

if (window.location.href.includes("user")) {
    document.addEventListener("DOMContentLoaded", setup);
    console.log("user script called");
}

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
            lessonIncrementButton.style.display = "none";

        }
    });

    const lessonIncrementButton = document.getElementById("lesson_increment");
    const emailBox = document.getElementById("email_box");

    lessonIncrementButton.addEventListener("click", increase);

    function increase() {
        const user = auth.currentUser.uid;
        const lessonReference = ref(database, `users/${user}/stats/lessons`);
        get(lessonReference).then((snapshot) => {
            const newLessons = snapshot.val()+1;
            set(ref(database, `users/${user}/stats/lessons`), newLessons);
            showStats(database, auth.currentUser);
        }).catch((error) => {
            console.error(error);
        });
    }
}

//read from database and update html
function showStats(database, user) {
    const statsReference = ref(database, `users/${user.uid}/stats`);
    get(statsReference).then((snapshot) => {
        if (snapshot.exists()) {
            const stats = snapshot.val();
            lessons.innerHTML = `Lessons played: ${stats.lessons}`;
            topics.innerHTML = `Topics completed: ${stats.topics}`;
            played.innerHTML = `Games played: ${stats.played}`;
            won.innerHTML = `Games won: ${stats.won}`;
            wpm.innerHTML = `Average WPM: ${stats.wpm}`;
            acc.innerHTML = `Average Accuracy: ${stats.acc}`;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    })
}