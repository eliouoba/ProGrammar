import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from "firebase/database";

if (window.location.href.includes("user")) {
    document.addEventListener("DOMContentLoaded", ()=> {
        console.log("user script called");

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

        showStats();

        //read from database 
        function showStats() {
            const lessons = document.getElementById("lessons");
            const topics = document.getElementById("topics");
            const played = document.getElementById("played");
            const won = document.getElementById("won");
            const wpm = document.getElementById("wpm");
            const acc = document.getElementById("acc");

            const u = auth.currentUser;
            console.log(auth);
            console.log("current user: " + u.uid);

            const stats = ref(database, 'users/' + u.uid + '/stats');
            console.log("stats");
            lessons.innerHTML += stats.lessons;
            topics.innerHTML += stats.topics;
            played.innerHTML += stats.played;
            won.innerHTML += stats.won;
            wpm.innerHTML += stats.wpm;
            acc.innerHTML += stats.acc;
        }    
    });
}