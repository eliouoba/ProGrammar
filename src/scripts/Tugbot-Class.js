//Josiah Hsu

class Tugbot{
    constructor(){
        this.score = document.getElementById("score");
        this.botacc = document.getElementById("setacc");
        this.botwpm = document.getElementById("setwpm");
        this.accuracy = this.botacc.value;
        this.wpm = this.botwpm.value;
    }

    /**
     * setwpm - sets this bot's wpm
     * @param {*} value the new wpm value
     */
    setwpm(value){
        this.wpm = value;
        document.getElementById("botwpm").innerHTML= this.wpm;
    }

    /**
     * setacc - sets this bot's accuracy
     * @param {*} value the new accuracy value
     */
    setacc(value){
        this.accuracy = value;
        document.getElementById("botacc").innerHTML= `${this.accuracy}%`;
    }

    /**
     * botInput - enters input for the bot, simulating opponent input
     */
    botInput(){
        let score = Number(this.score.value);
        
        if(this.accuracy < Math.random()*100){
            //incorrent - penalizes 3 points
            score = Math.max(0, score-3);
        }
        else{
            //correct - scores 1 point
            score = Math.min(100, score+1);
        }
        this.score.value = score;
    }
}