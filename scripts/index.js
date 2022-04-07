// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyC8TjMHSCAqxaqlIW2MNdbWWLp_vyWUBHA",
    authDomain: "programmar-d33e8.firebaseapp.com",
    projectId: "programmar-d33e8",
    storageBucket: "programmar-d33e8.appspot.com",
    messagingSenderId: "1017841820021",
    appId: "1:1017841820021:web:943e79503ad7292bb6b33c",
    measurementId: "G-6QTSB873J8"
};

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);