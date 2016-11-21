(function () {

	function getRequest(url, success) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = success;
		xhr.send();
		return xhr;
	}

	function ajaxCallsAllDone(statementCardsTsv, hackCardsTsv) {

		var decksize = 150;

		function frequencySum() {
			var sum = 0;

			for (var i = cards.length - 1; i >= 0; i--) {
				sum += cards[i].frequency;
			}

			return sum;
		}

		function calcCardsCount() {
			frequencySum = frequencySum();
			var relativeFrequency;

			for (var i = cards.length - 1; i >= 0; i--) {
				relativeFrequency = (cards[i].frequency / frequencySum);
				cards[i].count = Math.floor( relativeFrequency * decksize );
			}
		}

		function tsvParse(tsv) {
			var result = [];
			var rows = tsv.split("\n");
			var rowCells;
			var cell;

			for (var i = 1; i < rows.length; ++i) {
				rowCells = rows[i].split("\t");
				cell = {"text": rowCells[0].trim(), "description": rowCells[1].trim(), "frequency": parseInt(rowCells[2])};
				result.push(cell);
			}

			return result;
		}

		var statementCards = tsvParse(statementCardsTsv);
		var hackCards = tsvParse(hackCardsTsv);

		console.log(statementCards);
		console.log(hackCards);

		window.cards = cards = statementCards.concat(hackCards);//[ { text: "DrawCard(Self)", rarity: 10}, { text: "DrawCard(Other)", rarity: 10}, {text: "Function.Cycles--", rarity: 5}];

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
				div.innerHTML = ["<strong>", cards[i].text, "</strong><br><br>", "<small>", cards[i].description,"</small>"].join("");

				pageElement.appendChild(div);
				counter++;
			}
		}

		document.body.appendChild(pageElement);
	}

	document.addEventListener("DOMContentLoaded", function(event) {
		var ajaxCallsDone = 0;
		var ajaxCallsTotal = 2;

		var statementCardsTsv, hackCardsTsv;
		
		getRequest("/data/statements.tsv",
			function(e) {
				statementCardsTsv = e.target.response;

				ajaxCallsDone++;
				if (ajaxCallsDone >= ajaxCallsTotal) ajaxCallsAllDone(statementCardsTsv, hackCardsTsv);
			});

		getRequest("/data/hacks.tsv",
			function(e) {
				hackCardsTsv = e.target.response;

				ajaxCallsDone++;
				if (ajaxCallsDone >= ajaxCallsTotal) ajaxCallsAllDone(statementCardsTsv, hackCardsTsv);
			});

		// TODO(jakob): event cards doesn't have an occurance column
		// getRequest("https://docs.google.com/spreadsheets/d/1EPGT-rQ3ZZVdwJ9ynwHImz0V8JTM4AfSguATNVqDF10/pub?gid=484803621&single=true&output=tsv",
		// function(e) {
		// 	eventCardsTsv = e.tartget.response;

		// 	ajaxCallsDone++;
		// 	if (ajaxCallsDone > ajaxCallsTotal)	ajaxCallsAllDone();
		// });
	});
})();