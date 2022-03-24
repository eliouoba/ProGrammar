// Sam Burk

/* Param lesson: lesson code file
 * Will allow for loading different levels in the future
 */
function selectLevel(lesson, lang) {
    let url = window.location.href;
    url = `lesson.html?lesson=${lesson}&lang=${lang}`;
    window.location = url;
}