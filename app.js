document.addEventListener("DOMContentLoaded", function() {

	getRequest("data/cards.tsv", function(e) {
		
		// We now have the TSV card data
		var cardsTsv = e.target.response;
		var cards = tsvParse(cardsTsv, ["text", "description", "frequency", "type", "deck"]);

		// Calculate count of each card
		var deckFrequencySums = calcDeckFrequencySums(cards);
		var desiredDeckSizes = {"code": 100, "hacks": 60};
		var i = cards.length - 1;
		var card;

		for (; i >= 0; i--) {
			card = cards[i];

			cards[i].count = calcCardCount(
				card,
				deckFrequencySums[card.deck],
				desiredDeckSizes[card.deck]); // :)
		}

		// Construct the cards as html
		var counter = 0;
		var finalCounter = 0;
		var pageElement = document.createElement("div");
		pageElement.className = "page";

		for (var i = cards.length - 1; i >= 0; i--) {
			console.log(cards[i].type + "-count: " + cards[i].count);
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

				cardElement.appendChild(backgroundElement);
				cardElement.appendChild(textElement);
				cardElement.appendChild(descriptionElement);

				counter++;
				finalCounter++;
			}
		}

		console.log(finalCounter);

		document.body.appendChild(pageElement);
	});
	
	function getRequest(url, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = success;
		xhr.send();
		return xhr;
	}
	
	function arrayToObj(arr, keys) {
		var i = 0;
		var result = {};
		
		for (; i < keys.length; ++i) {
			result[keys[i]] = arr[i];
		}
		return result;
	}
	
	function tsvParse(tsv, columnKeys) {
		var rows = tsv.split("\n");
		var result = [];
		var i = 1; // skip first row which is just the column labels
		var l = rows.length;
		
		for (; i < l; ++i) {
			result.push(arrayToObj(rows[i].split("\t"), columnKeys));
		}
		return result;
	}

	function calcDeckFrequencySums(cards) {
		var result = {};
		var card, deck;

		for (var i = cards.length - 1; i >= 0; i--) {
			card = cards[i];
			deck = card.deck;

			result[deck] = (result[deck] || 0) + cards[i].frequency;
		}

		return result;
	}

	function calcCardCount(card, deckFrequencySum, desiredDeckSize) {
		if (card.type == "event") { return 1; }

		console.log(card.type);
		var relativeFrequency = (card.frequency / deckFrequencySum);

		return Math.round( relativeFrequency * desiredDeckSize);
	}
});
