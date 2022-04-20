/*
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
*/

import { 
  hideLoginError, 
  showLoginState, 
  showLoginForm, 
  //showApp, 
  showLoginError, 
  btnLogin,
  btnSignup,
  btnLogout,
  lblAuthState
} from './account-ui.js'

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


//login
const loginEmailPassword = async () => {
    const loginEmail = usernameBox.value;
    const loginPassword = passwordBox.value;
    
    try {
      const userCredential = 
          await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
          console.log(userCredential.user);
    } catch(error) {
      console.log(error);
      showLoginError(error);
    }
}
login.addEventListener("click", loginEmailPassword);


//create account
const createEmailPassword = async () => {
    const loginEmail = usernameBox.value;
    const loginPassword = passwordBox.value;
    
    try {
      const userCredential = 
          await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
          console.log(userCredential.user);
    } catch(error) {
      console.log(error);
      showLoginError(error);
    }
}
signup.addEventListener("click", createEmailPassword);

//detect authentication state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user=> {
      if(user != null) {
          console.log(user);  
          // showApp();
          showLoginState(user);
          hideLoginError();
      } else {
        lblAuthState.innerHTML = "You're not logged in.";
      }
  }); 
}

//log out
const logout = async () => {
  await signOut(auth);
  lblAuthState.innerHTML = "Logged out!";
}

logoutButton.addEventListener("click", logout);