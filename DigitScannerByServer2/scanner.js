var cnv = document.getElementById("canvas");
var ctx = cnv.getContext("2d");

var input = document.getElementById("digit");
var output = document.getElementById("results");
input.hidden = true;
var inputSet = false;

var mouseX = 0, mouseY = 0;
var mouseDown = false;

var pixels = new Array(28 * 28);

setInterval(function() {
	for(var i = 0; i < pixels.length; i++) {
		var x = i % 28;
		var y = Math.floor(i / 28);

		if(Math.sqrt(Math.pow(mouseX - (x * 10), 2) + Math.pow(mouseY - (y * 10), 2)) < 20 && mouseDown) {
			pixels[i] = true;
		} 

		ctx.fillStyle = pixels[i] ? "#003" : "#eef";
		ctx.fillRect(x * 10, y * 10, 10, 10);
	}

	ctx.fillStyle = mouseDown ? "#0008" : "#2202";
	ctx.beginPath();
	ctx.arc(mouseX, mouseY, 20, 20, 0, 360);
	ctx.fill();
	ctx.closePath();
}, 1000 / 30);

cnv.addEventListener("mousemove", function(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
});

cnv.addEventListener("mousedown", function(event) {
	mouseDown = true;
	pixels.fill(false);
});

input.onchange = function(event) {
	if(input.value < 0 || input.value > 9) {
		input.value = input.defaultValue;
	}else if(Math.round(input.value) != input.value) {
		input.value = Math.floor(input.value);
	}else {
		input.defaultValue = input.value;
		inputSet = true;
	}
};

function scan() {
	var imgString = "";
	for(var i = 0; i < pixels.length; i++) {
		imgString += pixels[i] ? "1" : "0";
	}
	var result;
	fetch("http://192.168.1.115:8083?image=" + imgString + "&label=" + (inputSet ? Math.floor(input.value) : "n"), {mode: 'cors', headers: {'Access-Control-Allow-Origin':'*'}}).then(response => response.json().then(data => show(data))).catch(error => console.log(error));
	input.hidden = true;
	inputSet = false;
}

function show(data) {
	output.innerHTML = "Results:<br>";
	for(var i = 0; i < 10; i++) {
		output.innerHTML += i + ": " + Math.round(data.data[i] * 1000) / 10 + "%<br>";
	}
}

cnv.addEventListener("mouseup", function(event) {
	mouseDown = false;
	inputSet = false;

	var pixelCount = 0;
	var sumX = 0;
	var sumY = 0;

	for(var i = 0; i < pixels.length; i++) {
		var x = i % 28;
		var y = Math.floor(i / 28);
		if(pixels[i]) {
			pixelCount++;
			sumX += x;
			sumY += y;
		}
	}
	
	sumX /= pixelCount;
	sumY /= pixelCount;
	sumX -= 14;
	sumY -= 14;
	
	var newPixels = new Array(28 * 28);
	for(var i = 0; i < newPixels.length; i++) {
		var x = i % 28;
		var y = Math.floor(i / 28);

		if(x + Math.round(sumX) > 0 && x + Math.round(sumX) < 28) {
			newPixels[i] = pixels[x + Math.round(sumX) + ((y + Math.round(sumY)) * 28)];
		}else {
			newPixels[i] = false;
		}
	}
	pixels = newPixels;

	var output = "";
	for(var i = 0; i < pixels.length; i++) {
		output += pixels[i] ? "1" : "0";
	}
	scan();
	input.hidden = false;
	input.value = "e";
	console.log(output);
});