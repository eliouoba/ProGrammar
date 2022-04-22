import { AuthErrorCodes } from 'firebase/auth';

if (window.location.href.includes("account")) {
    document.addEventListener("DOMContentLoaded", ()=> {
        console.log("account ui script called");
        const usernameBox = document.getElementById("usernameBox");
        const passwordBox = document.getElementById("passwordBox");

        const login = document.getElementById("login");
        const signup = document.getElementById("signup");

        const logoutButton = document.getElementById("logoutButton");

        const divAuthState = document.getElementById('divAuthState');
        const lblAuthState = document.getElementById('lblAuthState');


        const divLoginError = document.getElementById('divLoginError');
        const lblLoginErrorMessage = document.getElementById('lblLoginErrorMessage');

        /*
        const showLoginForm = () => {
        login.style.display = 'block'
        app.style.display = 'none'  
        }

        const showApp = () => {
        login.style.display = 'none'
        app.style.display = 'block'
        }*/

        const hideLoginError = () => {
            divLoginError.style.display = 'none'
            lblLoginErrorMessage.innerHTML = ''
        }

        const showLoginError = (error) => {
            divLoginError.style.display = 'block';  
            //switch(error.code) {
            // case AuthErrorCodes.INVALID_PASSWORD:

            // }
            
            
            //if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
                lblLoginErrorMessage.innerHTML = `Invalid username or password. Try again.`
            //}
            //else {
            // lblLoginErrorMessage.innerHTML = `Error: ${error.message}`      
        //}
        }
            

        const showLoginState = (user) => {
            lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
            console.log("called");
        }

        hideLoginError();
    });
}