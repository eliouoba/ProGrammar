// Sam Burk

//Arbitrary, will be linked to user profiles in the future
let levelsPassed = 16;

/* Param v: level number
 * Will allow for loading different levels in the future
 */
function selectLevel(v) {
    if (v <= levelsPassed + 1) { 
        window.location.href='sample-level.html';
    } else { 
        window.alert("You have not unlocked this level yet."); 
    }
}