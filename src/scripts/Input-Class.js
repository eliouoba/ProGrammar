//Josiah Hsu

export default class Input{
    constructor(){
        //quick element references
        this.stats = document.getElementById("stats");
        this.toType = document.getElementById("toType");
        this.toTypeBox = document.getElementById("toTypeBox");

        //variables/constants
        this.toTypeText; this.typed; this.currentline; //input
        this.time; this.errors; this.netwpm; this.accuracy; //stats
        this.entries; this.totalErrors; //accuracy
        this.lineHeight = window.getComputedStyle(this.toTypeBox).lineHeight.replace("px", '');
    }

    /**
     * init - sets initial state
     */
    init() {
        this.typed = [];
        this.currentline = 0;

        this.time = 0;
        this.errors = 0;
        this.netwpm = 0;
        this.accuracy = 100;

        this.entries = 0;
        this.totalErrors = 0;

        this.toTypeBox.style.overflowY = "hidden";
        this.toTypeBox.scrollTo(0,0);
        this.makeText();
    }

    /**
     * updateWPM - calculates user's net wpm
     */
    updateWPM(){
        const mins = this.time / 60;
        this.netwpm = Math.round(((this.typed.length / 5) - this.errors) / mins);
    }

    /**
     * getStats - returns array of stats
     */
    getStats(){
        return [this.time.toFixed(2), this.errors, this.netwpm, this.accuracy.toFixed(2)];
    }

    /**
     * displayStats - displays wpm, errors, and time
     */
    displayStats() {
        let sts = this.getStats();
        let txt = `Time: ${sts[0]} Errors: ${sts[1]} Net WPM: ${sts[2]} Accuracy: ${sts[3]}%`;
        this.stats.textContent = txt;
    }

    /**
     * updateAccuracy - calculates accuracy based on total entries/errors
     */
    updateAccuracy(){
        this.entries++;
        const pos = this.typed.length-1;
        if(this.typed[pos] != this.toTypeText[pos])
            this.totalErrors++;
        this.accuracy = ((this.entries - this.totalErrors) / this.entries) * 100;
    }

    /**
     * input - records input from keyboard in tracker
     * @param {*} key the key entered
     * @returns true if there was input, false if input was removed
     */
    input(key) {
        let input = true;
        switch (key) {
            case "Tab":
                this.typed.push('\t');
                break;
            case "Backspace":
                this.typed.pop();
                input = false;
                if (this.toTypeText[this.typed.length] == '\n'){
                    this.currentline--;
                    this.toTypeBox.scrollBy(0, -this.lineHeight);
                }
                break;
            case "Enter":
                this.typed.push('\n');
                break;
            default:
                if (key.length != 1)
                    return; //unsupported key
                this.typed.push(key);
        }
        if (input) {
            //new entry
            this.updateAccuracy();
            if (this.toTypeText[this.typed.length-1] == '\n' && ++this.currentline > 2)
                this.toTypeBox.scrollBy(0, this.lineHeight);
        }
        this.makeText(); 
        return input;
    }

    /**
     * makeText - creates representation of text typed 
     *              so far w/ HTML formatting/colors
     */
    makeText() {
        let text = ''; //typed portion
        let ref = ''; //reference portion
        let i;

        //create typed portion
        this.errors = 0;
        for (i = 0; i < this.typed.length; i++) {
            let c = this.typed[i], c2 = this.toTypeText[i];
            let correct = (c == c2);
            c = this.convertReserved(c);

            if (!correct) {
                this.errors++;
                c = this.convertInvis(c);
                if(c2 == '\n' || c2 == '\t')
                    c+=c2;
                c = `<mark>${this.convertInvis(c)}</mark>`; //highlights error
            }
            text += c;
        }
        text = `<b>${text}</b>`

        //outline next char
        if (i < this.toTypeText.length) {
            let c = this.toTypeText[i++];
            let nextChar = this.convertInvis(this.convertReserved(c));
            if(c == '\n' || c == '\t')
                nextChar+=c;
            ref = `<span style='border: 1px solid gray'>${nextChar}</span>`;
        }

        //create reference portion
        while (i < this.toTypeText.length) {
            ref += this.convertReserved(this.toTypeText[i++]);
        }
        ref = `<span style="color:gray">${ref}</span>`;

        //displays updated text, checks for lesson completion
        this.toType.innerHTML = text + ref;
        this.displayStats();
    }

    /**
     * convertReserved - converts reserved characters to their character codes. 
     *                  Nonreserved characters are left unchanged.
     * @param {*} c The character to convert.
     * @returns The converted character if reserved, the character itself otherwise.
     */
    convertReserved(c) {
        switch (c) {
            case '&':
                c = '&#38;';
                break;
            case '<':
                c = '&#60;';
                break;
            case '>':
                c = '&#62;';
                break;
        }
        return c;
    }

    /**
     * convertInvis - converts nonvisible characters to a corresponding visible character,
     *                  removing any associated functionality in the process.
     *                  Visible characters are left unchanged.
     * @param {*} c The character to convert.
     * @returns The converted character if nonvisible, the character itself otherwise.
     */
    convertInvis(c) {
        switch (c) {
            case '\n':
                c = '&#8629;'; //carrage return symbol
                break;
            case '\t':
                c = '&#8594;'; //right arrow symbol
                break;
        }
        return c;
    }

    /**
     * checkEnd - checks whether user has typed all
     *              characters in the lesson
     * @returns true if lesson is complete
     */
    checkEnd(){
        let end = this.typed.length == this.toTypeText.length
        if(end)
            this.toTypeBox.style.overflowY = "auto";
        return end;
    }
}