(function () {

	function getRequest(url, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = success;
		xhr.send();
		return xhr;
	}

	function frequencySum() {
		var sum = 0;

		for (var i = cards.length - 1; i >= 0; i--) {
			sum += cards[i].rarity;
		}

		return sum;
	}

	function calcCardsCount() {
		frequencySum = frequencySum();

		for (var i = cards.length - 1; i >= 0; i--) {
			cards[i].count = Math.floor( (cards[i].rarity / frequencySum) * decksize )
		}
	}

	document.addEventListener("DOMContentLoaded", function(event) {
		var decksize = 150;

		cards = [ { text: "DrawCard(Self)", rarity: 10}, { text: "DrawCard(Other)", rarity: 10}, {text: "Function.Cycles--", rarity: 5}];

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
				div.innerHTML = cards[i].text + " " + (j+1);

				pageElement.appendChild(div);
				counter++;
			}
		}

		document.body.appendChild(pageElement);
	});
})();