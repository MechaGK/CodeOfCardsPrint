document.addEventListener("DOMContentLoaded", function() {
	getRequest("data/cards.tsv", function(e) {
		var link = document.querySelector('link[rel="import"]');
		var template = link.import.querySelector('template');
		var clone = document.importNode(template.content, true);

		document.querySelector('#rules').appendChild(clone);

	// (function(){
		
		// We now have the TSV card data
		var cardsTsv = e.target.response;
		// test on local filesystem
		//cardsTsv = "Card name	Card description	Frequency	Type	Deck\nRemoveCycles(Function, 1)	Decrement function cycles	4	statement	code\nDamage(Other, 1)	Decrement Other Life with 1	10	statement	code\nOther.DiscardCard()	Other must discard a card	8	statement	code\nSelf.DiscardCard()	Self must discard a card	8	statement	code\nOther.DrawCard()	Other draws a card	6	statement	code\nSelf.DrawCard()	Self draw a card	6	statement	code\nAddCycles(Function, 2)	Increment function cycles	6	statement	code\nHeal(Other, 1)	Increment Other life with 1	6	statement	code\nHeal(Self, 1)	Increment Self life with 1	6	statement	code\nRepeat 3	Repeats code 3 times	6	controlflow	code\nRepeat 5	Repeats code 5 times	2	controlflow	code\ndelete Card	Remove code from function	6	hack	hacks\nFunction(Self, Other)	Execute one of your function	8	hack	hacks\nFunction(Other, Self)	Execute one of your function with Other as Self and Self as Other	8	hack	hacks\nAddCycles(Function, 10)	Adds 10 cycles to ANY function	6	hack	hacks\nRemoveCycles(Function, 10)	Removes 10 cycles from ANY function	6	hack	hacks\nPlace(Card, Function)	Place a card in ANY function	6	hack	hacks\nskip Code	Attach to ANY code and skip next time it is executed	10	hack	hacks\nbreak execution	Stops execution of ANY function	6	hack	hacks\nredirect execution	Swap Self and Other	4	hack	hacks\ntake ownership	Steal ANY function	1	hack	hacks\nOn Action Draw	When a player draws a card for an action	1	event	events\nOn Code Played	When a code card has been played	1	event	events\nOn Hack Played	When a hack has been played	1	event	events\nOn Card Discarded	When a card has been discarded	1	event	events\nOn Turn Start	When a player's turn start	1	event	events\nOn Turn End	When a player's turn end	1	event	events";

		var cards = tsvParse(cardsTsv, ["text", "description", "frequency", "type", "deck"]);

		// Calculate count of each card
		var deckFrequencySums = calcDeckFrequencySums(cards);
		var desiredDeckSizes = {"code": 100, "hacks": 60, "events": 6};
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
			card.frequency = parseInt(card.frequency);

			result[deck] = (result[deck] || 0) + card.frequency;
		}

		return result;
	}

	function calcCardCount(card, deckFrequencySum, desiredDeckSize) {
		console.log(card.type);
		var relativeFrequency = (card.frequency / deckFrequencySum);

		return Math.max(Math.round( relativeFrequency * desiredDeckSize), 1);
	}
});
