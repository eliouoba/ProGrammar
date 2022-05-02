// Sam Burk

/* Param lesson: lesson code file
 */
function selectLevel(lesson, lang) {
    let url = window.location.href;
    url = `lesson.html?lesson=${lesson}&lang=${lang}`;
    window.location = url;
}

module.exports = {
    selectLevel: selectLevel
}