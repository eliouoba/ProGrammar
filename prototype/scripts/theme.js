var currentTheme = sessionStorage.getItem('theme');
//console.log("current theme: " + currentTheme);
applyTheme(currentTheme);

function applyTheme(newTheme) {
    const html = document.getElementsByTagName("html")[0];
    const navbar = document.getElementById('nav_bar');
    sessionStorage.setItem('theme', newTheme);

    switch (newTheme) {
        case 'default':
            html.style.backgroundColor = "lemonchiffon";
            html.style.color = "black";
            navbar.style.backgroundColor = "lightgrey";
            break;
        case 'light':
            html.style.backgroundColor = "white";
            html.style.color = "blue";
            break;
        case 'dark':
            html.style.backgroundColor = "#222222";
            html.style.color = "white";
            break;
        case 'bronze':
            //html.style.backgroundColor = "#222222";
            //html.style.color = "white";
            // addVideo('bronze');
            break;
        case 'crimson':
            // html.style.backgroundColor = "#222222";
            // html.style.color = "white";
            //addVideo('crimson');
            break;
        case 'mist':
            //html.style.backgroundColor = "#222222";
            //html.style.color = "white";
            //addVideo('mist');
            break;
        default:
            break;
    }
}

function addVideo(video) {
    // let videoExists = document.querySelector("[src='html/background-video.html']") == null;
    //if (!videoExists) {
    const importStatement = '<import src="html/background-video.html"></import>';
    document.body.innerHTML = importStatement + document.body.innerHTML;
    // }
    //const imported = document.querySelector('[src="blank"]');
    //console.log(document.body.innerHTML);


    const imported = document.querySelector('.vid');
    console.log(imported);
    const videoSource = "files/" + video + ".mp4";
    imported.setAttribute('src', videoSource);

    //location.reload();
}