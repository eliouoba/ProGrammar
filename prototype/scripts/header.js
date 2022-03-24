//wait until all the HTML is loaded
document.body.innerHTML =
    `<nav class="nav_bar">
        <ul class="navlist">
            <a class="programmar nav_menu" href="index.html">ProGrammar</a>    
            <a class="nav_menu" href='lesson.html?lesson=SampleText.txt'>Sample lesson</a>
            <span class="nav_dividers">|</span>
            <!--button class=sample_lesson onclick="location.href='lesson.html'" type="button">Sample Lesson</button-->
            <a class="nav_menu" href='topics.html'>Topics</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu">Gaming</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu">User Profile</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu" id=userStats href='user.html'>User Stats</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu">Settings</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu" id="references" href='references.html'>References</a>
            <span class="nav_dividers">|</span>
            <a class="nav_menu" class="login nav_menu" href="login.html">Login</a>
        </ul>
    </nav>
    <style>
        .nav_bar {
            width: 100%;
            background-color: lightgrey;
            display: inline-block;
        }

        .navlist {
            list-style-type: none;
            padding: 0px;
        }

        .nav_menu {
            color: black;
            text-decoration: none;
            font-family: 'Montserrat', sans-serif;
            margin-left: 20px;
            margin-right: 20px;
            font-size: 16px;
        }

        .programmar {
            font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
            float: left;
            font-size: 30px;
            margin-right: 30px;
            margin-left: 20px;
        }

        .nav_menu:hover {
            color: white;
        }

        .login {
            float: right;
        }

        .nav_dividers {
            font-size: 30px;
        }
    </style>` +
document.body.innerHTML;