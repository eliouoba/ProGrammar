// Sam Burk

/* Param lesson: lesson code file
 * Will allow for loading different levels in the future
 */
function selectLevel(lesson) {
    let url = window.location.href;
    url = "sample-lesson.html?lesson=" + lesson;
    window.location = url;
}