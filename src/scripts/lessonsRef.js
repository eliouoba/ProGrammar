const lessons = 
["HelloWorld", "Integers", "BasicMath", "Strings", "Concatenation", "IfStatements", "WhileLoops", "ForLoops", "DoWhile", 
"PrintArray", "Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap", "Linear", "Binary", 
"Intro", "Format", "SuperSub", "Links", "Images", "Style", "Button", "Lists", "Table",
"Substring", "TryCatch", "ForEach", "Iterator", "Anonymous", "CheckPrime", "FibIt", "Fibonacci", "SD", 
"Sqrt", "Random", "Quadratic", "LeapYear", "Primes", "Factorial", "GCD", "LCM", "CardShuffle",
"ASCII", "StringSearch", "Clock", "Reverse", "ReverseArr", "BitCount", "DigitSum", "PrimeFactors", "IntToBinary",
"KM2M", "Palindrome", "SortWords", "ReverseString", "Replace", "RandomString", "CompareStrings", "Date", "RemoveItem"];

function getExtOpts(n){
    if(n > 53)
        return 's';
    else if(n > 44)
        return 'c';
    else if(n > 35)
        return 'p';
    else if(n > 26)
        return 'j';
    else if (n > 17)
        return 'h';
    else
        return 'jpc';
}

export { lessons, getExtOpts};