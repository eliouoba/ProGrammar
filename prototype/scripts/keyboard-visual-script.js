/* Eli Ouoba */

var capsLockDown = false;

//darken key when pressed
document.addEventListener("keydown", e => {
    if (e.key == "CapsLock") {
        if (capsLockDown) lighten(e);
        else darken(e);
        capsLockDown = !capsLockDown;
    } else if (e.key == "Tab") {
        e.preventDefault();
        darken(e);
    } else darken(e);
}, );

//lighten key when released
document.addEventListener("keyup", e => {
    if (e.key != "CapsLock")
        lighten(e); //For caps lock, only change color on "keydown" event
}, );

function lighten(event) {
    keyPressed = getKey(event);
    keyPressed.style.backgroundColor = "white";
    keyPressed.style.color = "black";
}

function darken(event) {
    keyPressed = getKey(event);
    keyPressed.style.backgroundColor = "silver";
    keyPressed.style.color = "white";
}

//find out which key was pressed
function getKey(event) {
    var keyPressed;
    if (event.key == "Shift")
        keyPressed = document.getElementById(event.code);
    else keyPressed = document.getElementById(event.key);
    if (keyPressed == null) //because caps lock is on
        keyPressed = document.getElementById(event.key.toLowerCase());
    return keyPressed;
}