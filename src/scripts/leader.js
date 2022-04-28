import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from "firebase/database";
import { auth, database } from './firebaseInit';


var tabs = document.querySelectorAll(".lboard_tabs ul li");
var WPM = document.querySelector(".WPM");
var accuracy = document.querySelector(".accuracy");
var games = document.querySelector(".games");
var items = document.querySelectorAll(".lboard_item");

tabs.forEach(function(tab){
	tab.addEventListener("click", function(){
		var currenttab = tab.getAttribute("data-li");
		
		tabs.forEach(function(tab){
			tab.classList.remove("active");
		})

		tab.classList.add("active");

		items.forEach(function(item){
			item.style.display = "none";
		})

		if(currenttab == "WPM"){
			WPM.style.display = "block";
		}
		else if(currenttab == "accuracy"){
			accuracy.style.display = "block";
		}
		else{
			games.style.display = "block";
		}

	})
})

function main(){
	const onewpm = document.getElementById("1wpm");
	const twowpm = document.getElementById("2wpm");
	const threewpm = document.getElementById("3wpm");
	const fourwpm = document.getElementById("4wpm");
	const fivewpm = document.getElementById("5wpm");

	if(currenttab == "WPM"){
		popAndSort()
	}
}

function sort(a, users){
	{
        var n = a.length;
        for (var i = 0; i < n - 1; i++)
            for (var j = 0; j < n - i - 1; j++)
                if (a[j] > a[j + 1]) {
                    var temp = a[j]
					var temp2 = users[j]
                    a[j] = a[j + 1]
					users[j] = users[j+1]
                    a[j + 1] = temp
					users[j+1] = temp2
                }
    }
}

//populate stat array, user array, sort parallel to each other, and display to tabs
function popAndSort(){
	const userRef = ref(database, 'users');
	var i = 0;
	var j = 0;
	var users=[];
	var wpm = [];
	//for each user, add their uID to the user array
	const allUserStats = ref(database, `stats/users`);
	get(allUserStats).then((snapshot) => {
		snapshot.forEach((child) => {
			users[i] = child.child(`username`).val();
			wpm[j] = parseInt(child.child(`wpm`).val());
			i++;
			j++;
		})
	})
	sort(wpm, users);

	//display top 5
	onewpm.innerHTML = wpm[0];
	twowpm.innerHTML = wpm[1];
	threewpm.innerHTML = wpm[2];
	fourwpm.innerHTML = wpm[3];
	fivewpm.innerHTML = wpm[4];
}
