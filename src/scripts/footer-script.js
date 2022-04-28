const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
const lessons = ["HelloWorld", "Integers", "BasicMath", "Strings", 
"Concatenation", "IfStatements", "WhileLoops", "ForLoops", "PrintArray",
"Bubble", "Selection", "Insertion", "Merge", "Quick", "Heap", "Linear", "Binary"];

document.getElementById("next").addEventListener("click", () => {
    let lesson = getNextLesson();
    window.location = `lesson.html?lesson=${lesson}&lang=jpc`
});

document.getElementById("last").addEventListener("click", () => {
    let lesson = getLastLesson();
    window.location = `lesson.html?lesson=${lesson}&lang=jpc`
});

function getNextLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) + 1;
    return lessons[n % lessons.length];
}

function getLastLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) - 1;
    return lessons[n < 0? lessons.length-1 : n];
}