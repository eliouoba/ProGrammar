var themes = new Map();
var colorSchemes = new Map();
var currentTheme = localStorage.getItem('theme');
if (currentTheme == null) currentTheme = 'default';
//var glowBox = document.getElementById("glow");
//var glowBoxExists = (glowBox != null);
// var glowing = localStorage.getItem('glowing');
// if (glowing == null) localStorage.setItem('glowing', false);

window.addEventListener("DOMContentLoaded", import1());

setUpThemes();

module.exports = {
    chooseTheme: chooseTheme
}

//allows us to import html from another file.

//Source of this script: 
// https://unpkg.com/htmlimpjs@1.0.0/index.js
function import1() {
    let imports = document.getElementsByTagName('import');
    for (var i = 0; i < imports.length; i++) {
        let imp = imports[i];
        load_file(imp.attributes.src.value, function(text) {
            imp.insertAdjacentHTML('afterend', text);
            imp.remove(); //removes import tag from html

            //once all imports are complete, apply theme
            if(imports.length == 0)
                chooseTheme(currentTheme, true);
        });

        function load_file(filename, callback) {
            fetch(filename).then(response => response.text()).then(text => callback(text));
        }
    }
}
//if (glowBoxExists) glowBox.addEventListener('change', handleglowBox);

function chooseTheme(newTheme, initialize) {
    //the calls from HTML pass false for initialize by default
    if (!initialize && newTheme == localStorage.getItem('theme')) return;
    localStorage.setItem('theme', newTheme);

    /* allow all pages to know the current primary text 
    color (usually white or black) so they can style accordingly */
    let textColor;
    let check = themes.get(newTheme);
    if (check == undefined) //meaning this is a video theme
        textColor = colorSchemes.get(currentTheme) ? "black" : "white";
    else textColor = themes.get(newTheme).html;
    localStorage.setItem('themeTextColor', textColor);
    currentTheme = newTheme;
    applyTheme(newTheme, colorSchemes.get(currentTheme));
}

function applyTheme(t, colorScheme) {
    let theme;
    if (typeof colorScheme === 'undefined') theme = themes.get(t);
    if (colorScheme == false) theme = themes.get("darkVideo");
    if (colorScheme == true) theme = themes.get("lightVideo");

    const html = document.documentElement; // like document.body
    html.style.backgroundColor = theme.htmlBackground;
    html.style.color = theme.html;

    const navbar = document.getElementById("nav_bar");
    navbar.style.backgroundColor = theme.navbarBackground;
    
    const footer = document.getElementById("footer");
    footer.style.backgroundColor = theme.footerBackground;   
        
    if (!theme.videoTheme) {
        navbar.style.boxShadow="0px 5px 10px 2px rgba(0, 0, 0, 0.205)";
        footer.style.boxShadow="0px -5px 10px 2px rgba(0, 0, 0, 0.205)";
    } else { 
        navbar.style.removeProperty("box-shadow");
        footer.style.removeProperty("box-shadow");
    }
    document.getElementById("next").style.color = theme.html;
    document.getElementById("last").style.color = theme.html;
    
    // if (glowing) navbar.style.boxShadow = "0px -30px 70px 20px " + themes.get("dark").glow;
    //if (glowBoxExists) handleglowBox();

    //no idea why this is necessary 
    const navitems = document.getElementsByClassName("nav_menu");
    for (let i = 0; i < navitems.length; i++)
        navitems[i].style.color = theme.html;

    const lessonHeader = document.getElementById("lesson-header");
    if (lessonHeader != null) {
        lessonHeader.style.color = theme.html;
    }
    const gamingHeader = document.getElementById("gaming-header");
    if (gamingHeader != null) {
        gamingHeader.style.color = theme.html;
    }
    //document.getElementById("nav_bar").style.boxShadow = "0px -30px 70px 20px " + theme.glow
    theme.videoTheme? addVideo(theme) : removeExistingVideo();
}

function removeExistingVideo() {
    const vid = document.getElementById('background-video');
    if (vid != null) vid.remove();
}

function addVideo(video) {
    removeExistingVideo();
    const path = "../files/video-backgrounds/" + localStorage.getItem('theme') + ".mp4";
    const vid =
        `<video autoplay muted loop id="background-video">
            <source src=` + path + ` id="select" type="video/mp4">
            <style>
            #background-video {
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100vw;
                object-fit: fill;
                z-index: -1;
            }
            </style>
        </video>`;
    document.body.insertAdjacentHTML("afterbegin", vid);
}

/*function handleglowBox() {
    const navbar = document.getElementById("nav_bar");
    if (currentTheme == "dark" && glowBox.checked == true) {
        navbar.style.boxShadow =
            "0px -30px 70px 20px " + themes.get("dark").glow;
        glowing=true;
        localStorage.setItem("glowing", true);
        return;
    } else {
        glowBox.checked = false;
        navbar.style.removeProperty("box-shadow");
        glowing=false;
        localStorage.setItem("glowing", false);

    }
}*/

function setUpThemes() {
    const defaultTheme = {
        "htmlBackground": "lemonchiffon",
        "html": "black",
        "navbarBackground": "lightgray",
        "footerBackground": "lightgray",
        "videoTheme": false
    }

    const lightTheme = {
        "htmlBackground": "white",
        "html": "blue",
        "navbarBackground": "lightgray",
        "footerBackground": "lightgray",
        "videoTheme": false
    }

    const darkTheme = {
        "htmlBackground": "#222222",
        "html": "white",
        "navbarBackground": "#151515",
        "footerBackground": "#151515",
        "videoTheme": false,
        "glow": "green"
    }

    const blackTheme = {
        "htmlBackground": "black",
        "html": "white",
        "navbarBackground": "#151515",
        "footerBackground": "#151515",
        "videoTheme": false,
        "glow": "green"
    }

    const lightVideoTheme = {
        "htmlBackground": "white",
        "html": "black",
        "navbarBackground": "transparent",
        "footerBackground": "rgba(255, 255, 255, 0.096)",
        "videoTheme": true
    }

    const darkVideoTheme = {
        "htmlBackground": "white",
        "html": "white",
        "navbarBackground": "transparent",
        "footerBackground": "rgba(255, 255, 255, 0.096)",
        "videoTheme": true
    }

    themes.set("default", defaultTheme);
    themes.set("light", lightTheme);
    themes.set("dark", darkTheme);
    themes.set("black", blackTheme);
    themes.set("lightVideo", lightVideoTheme);
    themes.set("darkVideo", darkVideoTheme);

    /* True means it will need dark text 
    and false means it will use white text */
    colorSchemes.set("aqua", true);
    colorSchemes.set("atlantic", false);
    colorSchemes.set("breakthrough", false);
    colorSchemes.set("bronze", false);
    colorSchemes.set("chlorophyll", false);
    colorSchemes.set("constellations", false);
    colorSchemes.set("crimson", false);
    colorSchemes.set("deep", false);
    colorSchemes.set("eve", false);
    colorSchemes.set("golden", false);
    colorSchemes.set("journey", false);
    colorSchemes.set("micro", false);
    colorSchemes.set("mist", true);
    colorSchemes.set("network", false);
    colorSchemes.set("sunlight", false);
}