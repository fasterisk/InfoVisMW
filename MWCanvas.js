function MWCanvas()
{
	var fillOrStroke = "fill";
	var fontSize = "50";
	var fontFace = "serif";
	var textFillColor = "#ff0000";
	var textBaseline = "middle";
	var textAlign = "center";
	var fontWeight = "normal";
	var fontStyle = "normal";

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	var formElement = document.getElementById("textBox");
	formElement.addEventListener('keyup', textBoxChanged, false);

	formElement = document.getElementById("textSubmitButton");
	formElement.addEventListener('click', submitButtonClicked, false);

	formElement = document.getElementById("fillOrStroke");
	formElement.addEventListener('change', fillOrStrokeChanged, false);

	formElement = document.getElementById("textSize");
	formElement.addEventListener('change', textSizeChanged, false);

	formElement = document.getElementById("textFillColor");
	formElement.addEventListener('change', textFillColorChanged, false);

	formElement = document.getElementById("textFont");
	formElement.addEventListener('change', textFontChanged, false);

	formElement = document.getElementById("textBaseline");
	formElement.addEventListener('change', textBaselineChanged, false);

	formElement = document.getElementById("textAlign");
	formElement.addEventListener('change', textAlignChanged, false);

	formElement = document.getElementById("fontWeight");
	formElement.addEventListener('change', fontWeightChanged, false);

	formElement = document.getElementById("fontStyle");
	formElement.addEventListener('change', fontStyleChanged, false);

	drawScreen();

	function drawScreen()
	{
		// Background
		context.fillStyle = '#ffffaa';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Box
		context.fillStyle = '#000000';
		context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

		// Text
		context.textBaseline = textBaseline;
		context.textAlign = textAlign;
		context.font = fontWeight + " " + fontStyle + " " + fontSize + "px "
				+ fontFace;

		var xPosition = (canvas.width / 2);
		var yPosition = (canvas.height / 2);

		switch (fillOrStroke)
		{
		case "fill":
			context.fillStyle = textFillColor;
			context.fillText(text, xPosition, yPosition);
			break;
		case "stroke":
			context.strokeStyle = textFillColor;
			context.strokeText(text, xPosition, yPosition);
			break;
		case "both":
			context.fillStyle = textFillColor;
			context.fillText(text, xPosition, yPosition);
			context.strokeStyle = "#000000";
			context.strokeText(text, xPosition, yPosition);
			break;
		}
	}

	function textBoxChanged(e)
	{
		var target = e.target;
		text = target.value;
		drawScreen();
	}

	function submitButtonClicked(e)
	{
		ReadText(text);
		drawScreen();
	}

	function fillOrStrokeChanged(e)
	{
		var target = e.target;
		fillOrStroke = target.value;
		drawScreen();
	}

	function textSizeChanged(e)
	{
		var target = e.target;
		fontSize = target.value;
		drawScreen();
	}

	function textFillColorChanged(e)
	{
		var target = e.target;
		textFillColor = "#" + target.value;
		drawScreen();
	}

	function textFontChanged(e)
	{
		var target = e.target;
		fontFace = target.value;
		drawScreen();
	}

	function textBaselineChanged(e)
	{
		var target = e.target;
		textBaseline = target.value;
		drawScreen();
	}

	function textAlignChanged(e)
	{
		var target = e.target;
		textAlign = target.value;
		drawScreen();
	}

	function fontWeightChanged(e)
	{
		var target = e.target;
		fontWeight = target.value;
		drawScreen();
	}

	function fontStyleChanged(e)
	{
		var target = e.target;
		fontStyle = target.value;
		drawScreen();
	}
}