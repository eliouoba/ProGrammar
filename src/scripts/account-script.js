import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    AuthErrorCodes
} from 'firebase/auth';

import { getDatabase, ref, set, } from "firebase/database";

if (window.location.href.includes("account")) {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {
    console.log("account script called");

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
    const database = getDatabase(app);
    const auth = getAuth(app);

    /* Initializing the UI */
    const emailBox = document.getElementById("email_box");
    const passwordBox = document.getElementById("password_box");
    const loginButton = document.getElementById("login_button");
    const signupButton = document.getElementById("signup_button");
    const logoutButton = document.getElementById("logout_button");
    const errorLabel = document.getElementById('error_label');
    const authStateLabel = document.getElementById('auth_state_label');

    loginButton.addEventListener("click", loginEmailPassword);
    signupButton.addEventListener("click", createEmailPassword);
    logoutButton.addEventListener("click", logOut);

    /* Notify the user if they are logged in already */
    onAuthStateChanged(auth, (user) => {
        if (user) authStateLabel.innerHTML =
            `You're currently logged in, ${user.email}`;
    });

    /** login with email and password */
    async function loginEmailPassword() {
        const loginEmail = emailBox.value;
        const loginPassword = passwordBox.value;

        try {
            const userCredential =
                await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            authStateLabel.innerHTML =
                `Welcome, ${userCredential.user.email}`;
        } catch (error) {
            console.log(error);
            showLoginError(error);
        }
    }

    /** create an account with email and password */
    async function createEmailPassword() {
        const loginEmail = emailBox.value;
        const loginPassword = passwordBox.value;
        try {
            const userCredential =
                await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
            initializeUser(userCredential.user);
        } catch (error) {
            console.log(error);
            showLoginError(error);
        }
    }

    /** add user to database with initial stats */
    function initializeUser(user) {
        set(ref(database, `users/${user.uid}/email`), user.email);
        set(ref(database, `users/${user.uid}/stats`), {
            lessons: 0,
            topics: 0,
            played: 0,
            won: 0,
            wpm: 0,
            acc: 0
        });
    }

    /** Log out */
    async function logOut() {
        await signOut(auth);
        authStateLabel.innerHTML = "Logged out!";
    }

    /** Show login failure information */
    async function showLoginError(error) {
        let errorMessage;
        switch (error.code) {
            case AuthErrorCodes.INVALID_PASSWORD:
            case AuthErrorCodes.INVALID_AUTH:
            case AuthErrorCodes.USER_DELETED:
                errorMessage = "Invalid login information. Try again."
                break;
            case AuthErrorCodes.INVALID_EMAIL:
                errorMessage = "Please enter a valid email."
                break;
            case AuthErrorCodes.EMAIL_EXISTS:
                errorMessage = "An account already exists under this email."
                break;
            case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
                errorMessage = "Too many attempts. Try again later.";
                break;
            case AuthErrorCodes.WEAK_PASSWORD:
                errorMessage = "Please choose a stronger password.";
                break;
            default:
                errorMessage = "Error. Please try again.";
        }
        errorLabel.innerHTML = errorMessage;
    }

}