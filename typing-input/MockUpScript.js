//Josiah Hsu
let chars, errors, time, interval, wpm, start, end;
const toType = document.getElementById("toType").innerHTML;
const textfield = document.getElementById("textfield");
const stats = document.getElementById("stats");
const typed = document.getElementById("typed");

textfield.length = toType.length;
init();

/**
 * init - sets initial state
 */
function init(){
    chars = 0;
    errors = 0;
    time = 0;
    wpm = 0;
    textfield.value = '';
    textfield.disabled = false;
    textfield.hidden = false;
    textfield.addEventListener("input", initType);
    typed.textContent = '';
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
    window.clearInterval(interval);
}

/**
 * timer - updates stats every second
 */
function timer(){
    time++;
    wpm = Math.round((chars / 5) / (time / 60));
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
 }

 /**
  * reset - reset to initial state
  */
 function reset(){
    alert("Resetting!");
    textfield.removeEventListener("input", type);
    init();
}

/**
 * initType - special event for first input
 * @param {*} inputEvent the inputEvent upon first type
 */
function initType(inputEvent){
    textfield.removeEventListener("input", initType);
    textfield.addEventListener("input", type);
    type(inputEvent);
    interval = window.setInterval(timer, 1000)
    start = Date.now();
}

/**
 * type - inputs a typed character and checks for correctness
 * @param {*} inputEvent the inputEvent for the type
 */
function type(inputEvent){
    if(inputEvent.inputType == "insertFromPaste" 
        || inputEvent.inputType == "insertFromDrop")
        //prevents pasting into textfield
        textfield.value = typed.textContent;
    else
        typed.innerHTML =  makeText();
    stats.textContent = `Time: ${time} Errors: ${errors} WPM: ${wpm}`;
    if(chars == toType.length){
        end = Date.now();
        clearInterval(interval);
        time = (end - start) / 1000;
        wpm = Math.round((chars / 5) / (time / 60))
        const netwpm = wpm - errors;
        alert(`Gross WPM: ${wpm}\nErrors: ${errors}\nNet WPM: ${netwpm}`);
        textfield.disabled = true;
        textfield.hidden = true;
        stats.textContent = `Final time: ${time} Errors: ${errors} Net WPM: ${netwpm}`;
    }
}

/**
 * makeText - function to create representation of text typed 
 *              so far w/ HTML formatting/colors
 * @returns HTML-formatted string of typed characters
 */
 function makeText(){
    let text = '';
    errors = 0;
    chars = textfield.value.length;
    for(var i = 0; i < chars; i++){
        let c = textfield.value[i];
        if(c == toType[i]){
            if(c == '\n')
                text+= '<br>';
            else
                text+=c;
        }
        else{
            switch(c){
                case ' ':
                    c = '_';
                    break;
                case '\n':
                    c = '<br>>';
                    break;
                case '\t':
                    c = ''
            }
            text += `<mark>${c}</mark>`;
            errors++;
        }
    }
    return text;
}