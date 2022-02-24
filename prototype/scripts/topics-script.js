// Sam Burk

let levelsPassed = 5;

const levelText = ["Here is level 1! Type this!", 
                    "You made it to level 2! Now type this!", 
                    "Wow, level 3! Well done!", 
                    "Level 4 gang!", 
                    "Nice job, you're on level 5!", 
                    "Welcome to level 6!", 
                    "This is good level design, right Dr. Kim?", 
                    "Why are you going this far?", 
                    "This level is probably invalid anyway", 
                    "Level 10 is pretty epic right?"];


formatButtons();

function selectLevel(v) {
    if (v <= levelsPassed + 1) { 
        document.getElementById("LevelText").innerHTML = levelText[v - 1];
    } else { 
        window.alert("You have not unlocked this level yet."); 
    }
}