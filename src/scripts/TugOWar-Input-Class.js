//Josiah Hsu

class TugOWarInput extends Input{
    constructor(){
        super();
        this.newlinecount = 0;
        this.score = document.getElementById("score");
    }

    /**
     * generate - appends new line of text to toTypeText
     */
    generate(){
        const len = this.wordlist.length;
        let str = "";
        while(str.length < 60){ //keep generated lines roughly the same length
            const x = Math.floor(Math.random() * len);
            str += this.wordlist[x] + ' ';
        }
        this.toTypeText += str.trim() + '\n';
        this.newlinecount++;
    }

    /**
     * init() - sets initial state
     * @override
     */
    init(){
        this.score.value = 50;
        this.newlinecount = 0;
        this.toTypeText = '';
        for(var i = 0; i < 6; i++)
            this.generate();
        super.init();
    }

    /**
     * input - records input from keyboard in tracker
     * @param {*} key the key entered
     * @returns true if there was input, false if input removed
     * @override
     */
    input(key){
        const pos = this.typed.length-1;
        const before = this.totalErrors;
        if(key == "Backspace" && this.typed[pos] != this.toTypeText[pos]){
            //correcting mistake - removes penalty from scorebar
            this.score.value = Number(this.score.value)-3
        }
        let input = super.input(key);
        if(input){
            //appends text if near end
            if(this.newlinecount - this.currentline == 4)
                this.generate();   

            //updates scorebar
            let newScore = Number(this.score.value);
            if(this.totalErrors > before){
                //incorrect - penalizes 3 points
                newScore=Math.min(100, newScore+3);
            }
            else{
                //correct - score 1 point
                newScore=Math.max(0, newScore-1);
            }
            this.score.value = newScore;
        }
        return input;
    }

    /**
     * checkEnd - checks whether a player has won the game
     * @returns true if the a player has won, false otherwise
     * @override
     */
    checkEnd(){
        const win = this.score.value == 0;
        const lose = this.score.value == 100;
        return win || lose;
    }
}