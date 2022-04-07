/*
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
*/

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator,
         getAuth, 
         onAuthStateChanged,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         signOut
} from 'firebase/auth';

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



/* authentication functions */
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

const usernameBox = document.getElementById("user");
const passwordBox = document.getElementById("passw");

const loginEmailPassword = async () => {
    const loginEmail = usernameBox.value;
    const loginPassword = passwordBox.value;
    const userCredential = 
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log(userCredential.user);
}

const login = document.getElementById("login");
login.addEventListener("click", loginEmailPassword);


createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});

//detect auth state
onAuthStateChanged(auth, user=> {
    if(user != null) {
        console.log('logged in!');  
    } else {
        console.log('No user!');
    }
});

