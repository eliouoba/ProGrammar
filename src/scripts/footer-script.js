const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
const lessons = ["HelloWorld", "Integers", "BasicMath", "Strings", 
"Concatenation", "IfStatements", "WhileLoops", "ForLoops", "DoWhile", "PrintArray",
"Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap", "Linear", "Binary", 
"Intro", "Format", "Supersub", "Links", "Images", "Style", "Button", "Lists", "Table",
"Substring", "TryCatch", "ForEach", "Iterator", "Anonymous", "CheckPrime", "FibIt",
"Fibonacci", "SD", "Sqrt", "Random", "Quadratic", "LeapYear", "Primes", "Factorial",
"GCD", "LCM", "CardShuffle", "ASCII", "StringSearch", "Clock", "Reverse", "ReverseArr",
"BitCount", "DigitSum", "PrimeFactors", "IntToBinary", "KM2M", "Palindrome", "SortWords",
"ReverseString", "Replace", "RandomString", "CompareString", "Date", "RemoveItem"];

document.getElementById("next").addEventListener("click", nextLesson);

document.getElementById("last").addEventListener("click", lastLesson);

function nextLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) + 1;
    n %= lessons.length;
    window.location = `lesson.html?lesson=${lessons[n]}&lang=${getExt(n)}`
}

function lastLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) - 1;
    if(n < 0)
        n = lessons.length-1;
    
    window.location = `lesson.html?lesson=${lessons[n]}&lang=${getExt(n)}`;
}

function getExt(n){
    return n < 18? 'jpc' : 'h';
}