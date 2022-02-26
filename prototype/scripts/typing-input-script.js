//Josiah Hsu
let errors, time, wpm, tracker
let start, end, interval;
let typeRef;

const stats = document.getElementById("stats");
const toType = document.getElementById("toType");

//load text into document
let httpx = new XMLHttpRequest();
httpx.open("GET", "files/SampleText.txt"); //determines which file to load
httpx.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        typeRef = this.responseText.replace(/    /g, "\t").replace(/\r/g, '');
        init();
    }
  };
httpx.send();


/**
 * init - sets initial state
 */
function init(){
    errors = 0;
    time = 0;
    wpm = 0;
    tracker = [];
    document.addEventListener("keydown", initType); 
    makeText();
    window.clearInterval(interval);
}

/**
 * timer - updates wpm and time
 */
function updateStats(){
    time = (Date.now() - start) / 1000;
    wpm = Math.round((tracker.length / 5) / (time / 60));
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
 }

 /**
  * reset - reset to initial state
  */
 function reset(){
    alert("Resetting!");
    document.removeEventListener("keydown", type);
    init();
}

/**
 * initType - special event for first input
 * @param {*} keydownEvent the keydownEvent upon first type
 */
function initType(keydownEvent){
    if(keydownEvent.key.length == 1){
        document.removeEventListener("keydown", initType);
        document.addEventListener("keydown", type);
        type(keydownEvent);
        interval = window.setInterval(updateStats, 250)
        start = Date.now();
    }
}

/**
 * type - records input from keyboard in tracker
 * @param {*} keydownEvent the keydownEvent 
 */
 function type(keydownEvent){
    switch(keydownEvent.key){
        case "Tab":
            keydownEvent.preventDefault();
            tracker.push('\t');
            break;
        case "Backspace":
            tracker.pop();
            break;
        case "Enter":
            tracker.push('\n');
            break;
        case " ":
            keydownEvent.preventDefault();
            tracker.push(' ');
            break;
        default:
            if(keydownEvent.key.length == 1){
                tracker.push(keydownEvent.key);
            }
    }
    makeText();
}

/**
 * makeText - function to create representation of text typed 
 *              so far w/ HTML formatting/colors
 */
 function makeText(){
    let text = '';
    let i;
    errors = 0;

    //typed portion
    text += '<b>';
    for(i = 0; i < tracker.length; i++){
        let c = tracker[i];
        let correct = (c == typeRef[i]);
        c = convertReserved(c);

        if(!correct){
            errors++;
            c = `<mark>${convertInvis(c)}</mark>`;
        }
        text+=c;
    }
    text += '</b>'

    //untyped portion
    text += '<span style="color:gray">'
    if(i < typeRef.length){
        //underlines next character
        text+=`<u>${convertInvis(typeRef[i])}</u>`;
        i++;
    }

    while (i < typeRef.length){
        text+=convertReserved(typeRef[i++]);
    }
    text += '</span>'
    
    toType.innerHTML = text;
    if(tracker.length == typeRef.length)
        endLesson();
    else
        stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
}

/**
 * convertReserved - converts reserved characters to their character codes. 
 *                  Nonreserved characters are left unchanged.
 * @param {*} c The character to convert.
 * @returns The converted character if reserved, the character itself otherwise.
 */
function convertReserved(c){
    switch(c){
        case '&': c = '&#38;'; break;
        case '<': c = '&#60;'; break;
        case '>': c = '&#62;'; break;
    }
    return c;
}

/**
 * convertInvis - converts nonvisible characters to a corresponding visible character.
 *              Visible characters are left unchanged.
 * @param {*} c The character to convert.
 * @returns The converted character if nonvisible, the character itself otherwise.
 */
function convertInvis(c){
    switch(c){
        case '\n': c = '&#8629;\n'; break; //carrage return symbol
        case '\t': c = '&#8594;\t'; break; //right arrow symbol
    }
    return c;
}

/**
 * endLesson - function that sets lesson to completed state
 */
function endLesson(){
    end = Date.now();
    clearInterval(interval);
    document.removeEventListener("keydown", type);
    time = (end - start) / 1000;
    wpm = Math.round((tracker.length / 5) / (time / 60))
    const netwpm = wpm - errors;
    alert(`Gross WPM: ${wpm}\nErrors: ${errors}\nNet WPM: ${netwpm}`);
    stats.textContent = `Final time: ${time} Errors: ${errors} Net WPM: ${netwpm}`;
}