window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded()
{
	window.TextHandler = new MWTextHandler();
	window.CurrentText = "maniwordle maniwordle maniwordle maniwordle maniwordle";
	window.TextHandler.ReadText(window.CurrentText);
	MainApp();
}
	
function MainApp()
{
	if (!canvasSupport())
	{
		return;
	}
	
	//Create Canvas
	var canvas = document.getElementById("canvas");
	window.Canvas = new MWCanvas(canvas);
	
	//Add event listener
	var formElement = document.getElementById("textBox");
	formElement.addEventListener('keyup', textBoxChanged, false);

	formElement = document.getElementById("textSubmitButton");
	formElement.addEventListener('click', submitButtonClicked, false);

	formElement = document.getElementById("fillOrStroke");
	formElement.addEventListener('change', fillOrStrokeChanged, false);

	formElement = document.getElementById("textFillColor");
	formElement.addEventListener('change', textFillColorChanged, false);

	formElement = document.getElementById("textFont");
	formElement.addEventListener('change', textFontChanged, false);

	formElement = document.getElementById("fontWeight");
	formElement.addEventListener('change', fontWeightChanged, false);

	formElement = document.getElementById("fontStyle");
	formElement.addEventListener('change', fontStyleChanged, false);
	
	formElement = document.getElementById("textRotation");
	formElement.addEventListener('change', textRotationChanged, false);
	
	//Initial DrawScreen call
	window.Canvas.Draw();

	function textBoxChanged(e)
	{
		var target = e.target;
		window.CurrentText = target.value;
	}

	function submitButtonClicked(e)
	{
		window.TextHandler.ReadText(window.CurrentText);
		window.Canvas.UpdateWordStyles();
		window.Canvas.Draw();
	}

	function fillOrStrokeChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFillOrStroke(target.value);
	}

	function textFillColorChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFillColor("#" + target.value);
	}

	function textFontChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFont(target.value);
	}

	function fontWeightChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontWeight(target.value);
	}

	function fontStyleChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontStyle(target.value);
	}
	
	function textRotationChanged(e)
	{
		var target = e.target;
		window.Canvas.SetTextRotation(target.value);
	}
}