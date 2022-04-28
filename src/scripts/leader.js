import { ref, get } from "firebase/database";
import { database } from './firebaseInit';


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

let noUser = ["", 0, 0, 0]
let userStats = [];
for(let i = 0; i < 5; i++){
	userStats.push(noUser);
}

populateStats();

/**
 * populateStats - populates the stats array with collections containing 
 * 					each users' wpm, accuracy, and # of wins
 */
function populateStats(){
	const allUserStats = ref(database, 'stats/users');
	get(allUserStats).then((snapshot) => {
		let children = snapshot.size;
		let count = 0;
		snapshot.forEach((child) => {
			let userRef = ref(database, `users/${child.key}`);
			get(userRef).then((snapshot) =>{
				let username = snapshot.child("username").val();
				let wpm = child.child("wpm").val();
				let acc = child.child("acc").val();
				let won = child.child("won").val();
				let lst = [username, wpm, acc, won];
				userStats.push(lst);
				
				//check if all stats have been retrieved
				count++;
				if(count == children){
					//wpm by default
					initializeTab("wpm");
					initializeTab("acc");
					initializeTab("won");
				}
			});
		})
	});
}

/**
 * initializeTab - sorts and records stats for the corresponding tab
 * @param {*} category either wpm, acc, or won
 */
function initializeTab(category){
	let index;
	let suffix;
	switch (category){
		case "wpm": 
			userStats.sort(compareWPM);
			index = 1;
			suffix = "WPM"
			break;
		case "acc": 
			userStats.sort(compareAcc);
			index = 2;
			suffix = "%"
			break;
		case "won": 
			userStats.sort(compareWon);
			index = 3;
			suffix = "wins"
			break;
	}

	let name = document.getElementsByClassName(`user_${category}`);
	let bar = document.getElementsByClassName(`${category}_inner_bar`);
	let points = document.getElementsByClassName(`${category}_points`);
	for(let i = 0; i < 5; i++){
		name[i].textContent = `${i+1}. ${userStats[i][0]}`;
	
		const percent = (userStats[i][index]/userStats[0][index]) * 100;
		bar[i].style.width = `${percent}%`;

		points[i].textContent = `${userStats[i][index]} ${suffix}`;
	}
}

//specialized comparison functions to sort stats

function compareWPM(a, b){
	return b[1] - a[1];
}

function compareAcc(a, b){
	return b[2] - a[2];
}

function compareWon(a, b){
	return b[3] - a[3];
}