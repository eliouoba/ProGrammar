//just trying this out for fun. Code borrowed from here:
//https://alvarotrigo.com/blog/css-animations-scroll/

reveal();
window.addEventListener("scroll", reveal);

document.body.innerHTML += 
    `<div class="row">
        <div class="column">
            <div class="card2">
                <h2>Lessons</h2>
                <p>Works through lessons either in order or sporadically to improve your speed, accuracy, and formatting skills!
                </p>
                <p><button class="button"=o nclick="location.href= 'topics.html'" type=b utton>Go to Lessons</button></p>
            </div>
        </div>
        <div class="column">
            <div class="card2">
                <h2>Gaming</h2>
                <p>Compete with your friends to see who has the best typing skills! This feature allows you to become a faster programmer and gives you bragging rights over your friends!
                </p>
                <p><button class="button"=o nclick="location.href= 'index.html'" type=b utton>Go to Gaming</button></p>
            </div>
        </div>
        <div class="column">
            <div class="card2">
                <h2>User Statistics</h2>
                <p>Allows you to view unique stats that you've compiled as you've used Programmar. Includes average WPM and accuracy.
                </p>
                <p><button class="button"=o nclick="location.href= 'user.html'" type=b utton>Go to User Stats</button></p>
            </div>
        </div>
        <style>
            @import "page-style.css";
            body {
                font-family: Arial, Helvetica, sans-serif;
                margin: 0;
            }

            html {
                box-sizing: border-box;
            }

            *,
            *:before,
            *:after {
                box-sizing: inherit;
            }

            .column {
                float: left;
                width: 33.3%;
                margin-bottom: 16px;
                padding: 0 8px;
            }

            .card2 {
                color: white;
                background-color: #474e5db2;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                margin: 8px;
                padding: 15%;
            }

            .about-section {
                padding: 50px;
                text-align: center;
                background-color: #474e5db2;
                color: white;
            }

            .container {
                padding: 0 16px;
            }

            .container::after,
            .row::after {
                content: "";
                clear: both;
                display: table;
            }

            .button {
                border: none;
                outline: 0;
                display: inline-block;
                padding: 8px;
                color: white;
                background-color: #000;
                text-align: center;
                cursor: pointer;
                width: 100%;
            }

            .button:hover {
                background-color: #555;
            }

            @media screen and (max-width: 650px) {
                .column {
                    width: 100%;
                    display: block;
                }
            }

            .row {
                position: relative;
                margin-top:150px;
                margin-top:150px;
                transform: translateY(150px);
                opacity: 0;
                transition: 2s all ease;
            }

            .row.active{
                transform: translateY(0);
                opacity: 1;
            }
        </style>
    </div>`;

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

