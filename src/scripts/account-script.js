import { initializeApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    AuthErrorCodes,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    getAdditionalUserInfo
} from 'firebase/auth';

import { getDatabase, ref, set, } from "firebase/database";

if (window.location.href.includes("account")) {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {

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
    const google = new GoogleAuthProvider();


    /* Initializing the UI */
    const usernameBox = document.getElementById("username_box");
    const emailBox = document.getElementById("email_box");
    const passwordBox = document.getElementById("password_box");
    const loginButton = document.getElementById("login_button");
    const signupButton = document.getElementById("signup_button");
    const logoutButton = document.getElementById("logout_button");
    const errorLabel = document.getElementById('error_label');
    const authStateLabel = document.getElementById('auth_state_label');
    const or = document.getElementById("or");
    const googleButton = document.getElementById("google_button");
    if (localStorage.getItem('themeTextColor') == "white")
        document.getElementById("container").style.backgroundColor = "rgb(60,60,60)";

    loginButton.addEventListener("click", loginEmailPassword);
    signupButton.addEventListener("click", signupConfiguration);
    logoutButton.addEventListener("click", logOut);
    googleButton.addEventListener("click", googleSignin);

    const signinHeader = document.getElementById("signin_header");
    const signinWith = document.getElementById("si_with");
    const signupHeader = document.getElementById("signup_header");
    const signupWith = document.getElementById("su_with");
    signinConfiguration();

    /* Notify the user if they are logged in already */
    var initial = true;
    onAuthStateChanged(auth, (user) => {
        if (user && initial) {
            usernameBox.style.display = "none";
            emailBox.style.display = "none";
            passwordBox.style.display = "none";
            loginButton.style.display = "none";
            or.style.display = "none";
            authStateLabel.innerHTML =
                `You're currently logged in, ${user.displayName}`;
            authStateLabel.style.display = "flex";
            initial = false;
        }
    });

    /** login with email and password */
    async function loginEmailPassword() {
        const loginEmail = emailBox.value;
        const loginPassword = passwordBox.value;

        try {
            const userCredential =
                await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            authStateLabel.innerHTML =
                `Welcome, ${userCredential.user.displayName}`;
        } catch (error) {
            console.log(error.message);
            errorLabel.style.display = "flex";
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
            signupButton.style.display = "none";
            initializeUser(userCredential.user);
            let username = usernameBox.value;
            authStateLabel.innerHTML =
                `Welcome, ${username}`;
        } catch (error) {
            console.log(error.message);
            errorLabel.style.display = "flex";
            showLoginError(error);
        }
    }

    /** Sign in with Google */
    function googleSignin() {
        signInWithPopup(auth, google)
            .then((result) => {
                const newUser =
                    getAdditionalUserInfo(result).isNewUser;
                if (newUser)
                    googleInitializeUser(result.user);
                errorLabel.style.display = "none";
                authStateLabel.innerHTML =
                    `Welcome, ${result.user.displayName}`;
            }).catch((error) => {
                console.log(error.message);
            });
    }


    /** Showing the UI options for signing in */
    function signinConfiguration() {
        signupHeader.style.display = "none";
        signupWith.style.display = "none";
        usernameBox.style.display = "none";
        errorLabel.style.display = "none";
        authStateLabel.style.display = "none";
    }

    /** Showing the options for creating an account */
    function signupConfiguration() {
        signinHeader.style.display = "none";
        signinWith.style.display = "none";
        signupHeader.style.display = "flex";
        signupWith.style.display = "flex";
        usernameBox.style.display = "flex";
        emailBox.style.display = "flex";
        passwordBox.style.display = "flex";
        signupButton.style.display = "inline";
        loginButton.style.display = "none";
        or.style.display = "none";
        authStateLabel.style.display = "none";
        errorLabel.innerHTML = "";
        signupButton.addEventListener("click", createEmailPassword);
    }

    /** add user to database with initial stats */
    function initializeUser(user) {
        updateProfile(user, { displayName: usernameBox.value });
        set(ref(database, `users/${user.uid}/email`), user.email);
        set(ref(database, `users/${user.uid}/stats`), {
            lessons: 0,
            topics: 0,
            played: 0,
            won: 0,
            wpm: 0,
            acc: 0
        });
        //so we can easily look through stats
        /**not working yet 
        set(ref(database, `stats`), {
            lessons: { value: 0, user: user.uid },
            topics: { value: 0, user: user.uid },
            played: { value: 0, user: user.uid },
            won: { value: 0, user: user.uid },
            wpm: { value: 0, user: user.uid },
            acc: { value: 0, user: user.uid },
        }); */
    }

    /** Initialization is handled differently with Google sign-in */
    function googleInitializeUser(user) {
        set(ref(database, `users/${user.uid}/username`), user.displayName);
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
        if (auth.currentUser == null) return;
        await signOut(auth);
        authStateLabel.innerHTML = "Logged out!";
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
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
                errorMessage = "Password should be at least 6 characters.";
                break;
            default:
                errorMessage = "Error. Please try again.";
        }
        errorLabel.innerHTML = errorMessage;
    }
}