const urlParams = new URLSearchParams(window.location.search);
const lessonFile = urlParams.get("lesson");
import { lessons, getExtOpts } from './lessonsRef.js';
document.getElementById("next").addEventListener("click", nextLesson);

document.getElementById("last").addEventListener("click", lastLesson);

function nextLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) + 1;
    n %= lessons.length;
    window.location = `lesson.html?lesson=${lessons[n]}&lang=${getExtOpts(n)}`
}

function lastLesson() {
    let n = lessons.findIndex((element) => element == lessonFile) - 1;
    if(n < 0)
        n = lessons.length-1;
    
    window.location = `lesson.html?lesson=${lessons[n]}&lang=${getExtOpts(n)}`;
}