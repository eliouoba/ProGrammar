import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    AuthErrorCodes,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    getAdditionalUserInfo,
    deleteUser
} from 'firebase/auth';

import { ref, set, remove } from "firebase/database";

import { auth, database } from './firebaseInit';

if (window.location.href.includes("account")) {
    document.addEventListener("DOMContentLoaded", main);
}

function main() {
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
    const deleteButton = document.getElementById("delete_button");
    const container = document.getElementById("container");
    const back = document.getElementById("back");

    //Change account panel color
    switch (localStorage.getItem('themeTextColor')) {
        case "navy":
            container.style.backgroundColor = "lightgray";
            container.style.boxShadow = "0px 1px 3px gray";
            break;
        case "black":
            container.style.backgroundColor = "white";
            container.style.boxShadow = "0px 1px 3px gray";
            break;
        case "red": 
            container.style.backgroundColor = "black";
            container.style.boxShadow = "0px 1px 3px black";
            break;
        default:    //most light colors
            container.style.backgroundColor = "rgb(60,60,60)";
            container.style.boxShadow = "0px 1px 3px black";
    }
    if (localStorage.getItem('themeTextColor') == "white")
        container.style.backgroundColor = "rgb(60,60,60)";
    if (localStorage.getItem('themeTextColor') == "blue")
        container.style.backgroundColor = "lightgray";

    loginButton.addEventListener("click", loginEmailPassword);
    signupButton.addEventListener("click", signupConfiguration);
    logoutButton.addEventListener("click", logOut);
    googleButton.addEventListener("click", googleSignin);
    deleteButton.addEventListener("click", deleteAccount);
    back.addEventListener("click", signinConfiguration);
    
    //Enter to submit
    document.onkeydown = (e) => {
        if (e.key == "Enter") loginEmailPassword()};
    
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
            googleButton.style.display = "none";
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
        let username = usernameBox.value;
        if (usernameBox.value.length < 6) {
            alert("Please enter at least 6 characters for the username.");
            return;
        }
        try {
            const userCredential =
                await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
            signupButton.style.display = "none";
            initializeUser(userCredential.user);
            authStateLabel.innerHTML =
                `Welcome, ${username}`;
            errorLabel.style.display = "none";

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
        back.style.display = "none";
        signinHeader.style.display = "grid";
        signinWith.style.display = "grid";
        or.style.display = "flex";
        googleButton.style.display="inline-flex";
        signupButton.style.display="inline";
        loginButton.style.display="inline";

        document.onkeydown = (e) => {
            if (e.key == "Enter") {
                loginEmailPassword();
                let boxes = document.getElementsByTagName("input");
                for (let i = 0; i < boxes.length; i++) 
                    boxes[i].blur();
            }
        };
    }

    /** Showing the options for creating an account */
    function signupConfiguration() {
        signinHeader.style.display = "none";
        signinWith.style.display = "none";
        signupHeader.style.display = "grid";
        signupWith.style.display = "grid";
        usernameBox.style.display = "inline";
        emailBox.style.display = "inline";
        passwordBox.style.display = "inline";
        signupButton.style.display = "inline";
        loginButton.style.display = "none";
        googleButton.style.display = "none";
        or.style.display = "none";
        authStateLabel.style.display = "none";
        errorLabel.innerHTML = "";
        back.style.display = "flex";
        document.onkeydown = (e) => {
            if (e.key == "Enter") {
                let boxes = document.getElementsByTagName("input");
                for (let i = 0; i < boxes.length; i++) 
                    boxes[i].blur();
                createEmailPassword();
            }
        }
        signupButton.addEventListener("click", createEmailPassword);
    }

    /** add user to database with initial stats */
    function initializeUser(user) {
        updateProfile(user, { displayName: usernameBox.value });
        set(ref(database, `users/${user.uid}/username`), user.displayName);
        set(ref(database, `users/${user.uid}/email`), user.email);
        set(ref(database, `users/${user.uid}/stats`), {
            lessons: 0,
            topics: 0,
            played: 0,
            won: 0,
            wpm: 0,
            acc: 0
        });
        
        initStats(user.uid);
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

        initStats(user.uid);
    }

    /**
     * initStats - initialize stats for a given user
     * @param {*} uid User ID to initialize stats for
     */
    function initStats(uid){
        let pathNames = ["lessons", "topics", "played", "won", "wpm", "acc"];
        pathNames.forEach( (path)=>{
            set(ref(database, `stats/${path}/${uid}/value`), 0 );
        });
    }

    /** Log out */
    async function logOut() {
        if (auth.currentUser == null) return;
        await signOut(auth);
        authStateLabel.innerHTML = "Logged out!";
        setTimeout(window.location.reload(), 1500);
        //await new Promise(resolve => setTimeout(resolve, 1500));
        //window.location.reload();
    }

    /** Delete account and clear info from database. */
    function deleteAccount() {
        let user = auth.currentUser;
        if (user == null) alert("No user logged in!");
        else {
            //let msg = 'Are you sure you want to delete your account? This action is permanent.'
            //if (confirm(msg)) {
                deleteUser(user).then(() => {
                    //alert("Your account has been deleted.");
                   // setTimeout(window.location.reload(), 500);
                }).catch((error) => {
                    console.log(error.message);
                });
                remove(ref(database, `users/${user.uid}`));

                let pathNames = ["lessons", "topics", "played", "won", "wpm", "acc"];
                pathNames.forEach( (path)=>{
                    remove(ref(database, `stats/${path}/${user.uid}`));
                });
        }
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
