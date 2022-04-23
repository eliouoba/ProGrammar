//just trying this out for fun. Code borrowed from here:
//https://alvarotrigo.com/blog/css-animations-scroll/

//reveal();
window.addEventListener("scroll", reveal);

function reveal() {
    var reveals = document.querySelectorAll(".row");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        } else {
            reveals[i].classList.remove("active");
        }
    }
}