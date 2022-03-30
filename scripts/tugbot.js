//Josiah Hsu

document.addEventListener("DOMContentLoaded", initBot)

let b_score, b_accuracy, b_wpm, bot;

function initBot(){
    b_score = document.getElementById("score");
    b_accuracy = 100;
    b_wpm = 20;
    document.addEventListener("keydown", startGame);
}

function startGame(keydownEvent){
    if(keydownEvent.key.length == 1){
        document.removeEventListener("keydown", startGame);
        chars_per_sec = (b_wpm * 5) / 60;
        bot = window.setInterval(botType, 1000/chars_per_sec);
    }
}

function botType(){
    let score = Number(b_score.value);
    
    if(score == 0 || score == 100) {
        window.clearInterval(bot);
        return;
    }
    
    let r = Math.round(Math.random() * 100);
    if(r > b_accuracy){
        //corrent
        score = Math.max(0, score-3);
    }
    else{
        //incorrect
        score = Math.min(100, score+1);
    }
    b_score.value = score;

    if(score == 0 || score == 100)
        window.clearInterval(bot);
}
