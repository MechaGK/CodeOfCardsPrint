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

		var decksize = {"statement": 100, "hack": 60};

		function frequencySum(type) {
			var sum = 0;

			for (var i = cards.length - 1; i >= 0; i--) {
				if (cards[i].type != type) continue;
				sum += cards[i].frequency;
			}

			return sum;
		}

		function calcCardsCount(type) {
			var freqSum = frequencySum(type);
			var relativeFrequency;

			for (var i = cards.length - 1; i >= 0; i--) {
				if (cards[i].type == "event") {
					cards[i].count = 1;
					continue;
				}

				console.log(cards[i].type)
				if (cards[i].type != type) continue;
				relativeFrequency = (cards[i].frequency / freqSum);
				cards[i].count = Math.round( relativeFrequency * decksize[type] );
			}
		}

		function calcCardsCountAll() {
			calcCardsCount("statement")
			calcCardsCount("hack")
			calcCardsCount("event")
		}

		var cards = JSON.parse(cards_data);
		console.log(cards);

		calcCardsCountAll();

		var counter = 0;
		var finalCounter = 0;
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

				var cardElement = document.createElement("div");
				cardElement.className = "card card-type-" + cards[i].type;

				var textElement = document.createElement("span");
				textElement.innerHTML = cards[i].text;
				textElement.className = "text";

				var descriptionElement = document.createElement("span");
				descriptionElement.innerHTML = cards[i].description;
				descriptionElement.className = "description";

				var backgroundElement = document.createElement("span");
				backgroundElement.innerHTML = cards[i].type;
				backgroundElement.className = "background";

				pageElement.appendChild(cardElement);

				cardElement.appendChild(backgroundElement)
				cardElement.appendChild(textElement);
				cardElement.appendChild(descriptionElement)

				counter++;
				finalCounter++;
			}
		}

		console.log(finalCounter);

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
