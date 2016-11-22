(function () {

	function getRequest(url, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = success;
		xhr.send();
		return xhr;
	}

	function ajaxCallsAllDone(cards_data) {
		console.log(cards_data)

		var decksize = 150;

		function frequencySum() {
			var sum = 0;

			for (var i = cards.length - 1; i >= 0; i--) {
				if (cards[i].type == "event") continue;
				sum += cards[i].frequency;
			}

			return sum;
		}

		function calcCardsCount() {
			frequencySum = frequencySum();
			var relativeFrequency;

			for (var i = cards.length - 1; i >= 0; i--) {
				if (cards[i].type == "event") {
					cards[i].count = 1;
					continue;
				}
				relativeFrequency = (cards[i].frequency / frequencySum);
				cards[i].count = Math.floor( relativeFrequency * decksize );
			}
		}

		var cards = JSON.parse(cards_data);
		console.log(cards);

		calcCardsCount();

		var counter = 0;
		var pageElement = document.createElement("div");
		pageElement.className = "page";

		for (var i = cards.length - 1; i >= 0; i--) {
			for (var j = cards[i].count - 1; j >= 0; j--) {
				if (counter >= 30) {
					document.body.appendChild(pageElement);
					pageElement = document.createElement("div");
					pageElement.className = "page";

					counter = 0;
				}

				var div = document.createElement("div");
				div.className = "card";

				var textElement = document.createElement("span");
				textElement.innerHTML = cards[i].text;
				textElement.className = "text";

				var descriptionElement = document.createElement("span");
				descriptionElement.innerHTML = cards[i].description;
				descriptionElement.className = "description";

				var backgroundElement = document.createElement("span");
				backgroundElement.innerHTML = cards[i].type;
				backgroundElement.className = "background";

				pageElement.appendChild(div);

				div.appendChild(backgroundElement)
				div.appendChild(textElement);
				div.appendChild(descriptionElement)

				counter++;
			}
		}

		document.body.appendChild(pageElement);
	}

	document.addEventListener("DOMContentLoaded", function(event) {
		getRequest("data/cards.json",
			function(e) {
				var cards = e.target.response;

				ajaxCallsAllDone(cards);
			});
	});
})();