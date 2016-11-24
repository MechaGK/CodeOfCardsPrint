document.addEventListener("DOMContentLoaded", function() {
    var color = true;
	var printRules = true;

    document.getElementById("colorsCheck").checked = color;
    document.getElementById("rulesCheck").checked = printRules;

	document.getElementById("colorsCheck").onclick = function (ev) {
        color = ev.target.checked;
		document.body.classList.toggle("color", color)
	};

	document.getElementById("rulesCheck").onchange = function (ev) {
        printRules = ev.target.checked;
        document.getElementById("rules").classList.toggle("hide-print", !printRules);
	};

    document.getElementById("printButton").onclick = function (ev) {
        window.print();
    }
});