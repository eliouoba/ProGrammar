/* Eli Ouoba */

var capsLockDown = false;

//darken key when pressed
document.addEventListener("keydown", keyPressed);

//lighten key when released
document.addEventListener("keyup", keyReleased);

function keyPressed(e) {
    if (e.key == "CapsLock") {
        if (capsLockDown) lighten(e);
        else darken(e);
        capsLockDown = !capsLockDown;
    } else if (e.key == "Tab") {
        e.preventDefault();
        darken(e);
    } else darken(e);
}

function keyReleased(e) {
    if (e.key != "CapsLock")
        lighten(e); //For caps lock, only change color on "keydown" event
}

function lighten(event) {
    keyPressed = getKey(event);
    if (keyPressed == null) return;
    keyPressed.style.backgroundColor = "white";
    keyPressed.style.color = "black";
}

function darken(event) {
    keyPressed = getKey(event);
    if (keyPressed == null) return;
    keyPressed.style.backgroundColor = "silver";
    keyPressed.style.color = "white";
}

function getKey(event) {
    var keyPressed;
    const key = convertKey(event.key);
    if (key == "Shift")
        keyPressed = document.getElementById(event.code);
    else keyPressed = document.getElementById(key);
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