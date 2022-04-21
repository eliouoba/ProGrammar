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

import { connectDatabaseEmulator, 
          getDatabase, 
          ref, 
          set, 
} from "firebase/database";

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


//authentication functions 
const auth = getAuth(app);
//connectAuthEmulator(auth, "http://localhost:9099");
//connectDatabaseEmulator(database, "http://localhost:9000"); 

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

//login
const loginEmailPassword = async () => {
    const loginEmail = usernameBox.value;
    const loginPassword = passwordBox.value;
    
    try {
      const userCredential = 
          await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
          console.log(userCredential.user);
          lblAuthState.innerHTML = "logged in as user id " + userCredential.user.uid;

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
          const u = userCredential.user;
          console.log(u);
          initializeUser();
    } catch(error) {
      console.log(error);
      showLoginError(error);
    }
}
signup.addEventListener("click", createEmailPassword);

//add user to database with starting stats
function initializeUser() {
  const u = auth.currentUser;
  set(ref(database, "users/"+ u.uid), {
    email: u.email
  });
  
  set(ref(database, "users/" + u.uid + "/stats"), {
      lessons: 0,
      topics: 0,
      played: 0,
      won: 0,
      wpm: 0,
      acc: 0
    });
}

//detect authentication state
const monitorAuthState = async () => {
  onAuthStateChanged(auth, user=> {
    console.log("called");  
    if(user != null) {
          console.log(user);  
          // showApp();
          //showLoginState(user);
          //hideLoginError();
          alert("logged in as user id " + user.uid);
      } else {
        alert("logged out");

        //lblAuthState.innerHTML = "You're not logged in.";
      }
  }); 
}

//log out
const logout = async () => {
  await signOut(auth);
  lblAuthState.innerHTML = "Logged out!";
}

logoutButton.addEventListener("click", logout);

//another lesson completed
function lessonIncrement() {
  const u = auth.currentUser;
  const currentLessons = ref(database, "users/" + u.uid + "/stats/lessons");
  set(ref(database, "users/" + u.uid + "/stats/lessons"), 
  currentLessons+1 );
}
