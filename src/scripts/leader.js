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
