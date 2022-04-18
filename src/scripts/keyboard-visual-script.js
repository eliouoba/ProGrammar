/* Eli Ouoba */

//determine keyboard color theme
var keyboardTheme = localStorage.getItem('keyboardTheme');
if(keyboardTheme == 'color'){
    var link = document.createElement('link');
    link.rel = "stylesheet";    
    link.type = "text/css";
    link.href = "../styles/keyboard-style.css";
    document.head.appendChild(link);
}

var capsLockDown = false;

//darken key when pressed
document.addEventListener("keydown", keyPressed);

//lighten key when released
document.addEventListener("keyup", keyReleased);

function keyPressed(e) {
    if (e.key == "CapsLock") {
        capsLockDown? lighten(e) : darken(e);
        capsLockDown = !capsLockDown;
    }
    else {
        if (e.key == "Tab" || e.key == " ")
            e.preventDefault();
        darken(e);
    }
}

function keyReleased(e) {
    if (e.key != "CapsLock")
        lighten(e); //For caps lock, only change color on "keydown" event
}

function lighten(event) {
    let key = getKey(event);
    if (key != null)
        key.style.filter = "brightness(100%)";
}

function darken(event) {
    let key = getKey(event);
    if (key != null)
        key.style.filter = "brightness(70%)";
}

function getKey(event) {
    var keyPressed;
    const key = convertKey(event.key);
    keyPressed = document.getElementById(key=="Shift"? event.code : key);
    if (keyPressed == null) //because caps lock is on
        keyPressed = document.getElementById(key.toLowerCase());
    return keyPressed;
}

function convertKey(k){
    switch(k){
        case '~': k = '`'; break;
        case '!': k = '1'; break;
        case '@': k = '2'; break;
        case '#': k = '3'; break;
        case '$': k = '4'; break;
        case '%': k = '5'; break;
        case '^': k = '6'; break;
        case '&': k = '7'; break;
        case '*': k = '8'; break;
        case '(': k = '9'; break;
        case ')': k = '0'; break;
        case '_': k = '-'; break;
        case '+': k = '='; break;
        case '{': k = '['; break;
        case '}': k = ']'; break;
        case '|': k = '\\'; break;
        case ':': k = ';'; break;
        case '\"': k = '\''; break;
        case '<': k = ','; break;
        case '>': k = '.'; break;
        case '?': k = '/'; break;
    }
    return k;
}