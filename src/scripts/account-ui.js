console.log("account ui script called");

import { AuthErrorCodes } from 'firebase/auth';

export const usernameBox = document.getElementById("usernameBox");
export const passwordBox = document.getElementById("passwordBox");

export const login = document.getElementById("login");
export const signup = document.getElementById("signup");

export const logoutButton = document.getElementById("logoutButton");

export const divAuthState = document.getElementById('divAuthState');
export const lblAuthState = document.getElementById('lblAuthState');


export const divLoginError = document.getElementById('divLoginError');
export const lblLoginErrorMessage = document.getElementById('lblLoginErrorMessage');

/*
export const showLoginForm = () => {
  login.style.display = 'block'
  app.style.display = 'none'  
}

export const showApp = () => {
  login.style.display = 'none'
  app.style.display = 'block'
}*/

export const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
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

export const showLoginState = (user) => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
  console.log("called");
}

hideLoginError();