window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded()
{
	window.TextHandler = new MWTextHandler();
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

	formElement = document.getElementById("textSize");
	formElement.addEventListener('change', textSizeChanged, false);

	formElement = document.getElementById("textFillColor");
	formElement.addEventListener('change', textFillColorChanged, false);

	formElement = document.getElementById("textFont");
	formElement.addEventListener('change', textFontChanged, false);

	formElement = document.getElementById("fontWeight");
	formElement.addEventListener('change', fontWeightChanged, false);

	formElement = document.getElementById("fontStyle");
	formElement.addEventListener('change', fontStyleChanged, false);
	
	//Initial DrawScreen call
	window.Canvas.Draw();

	function textBoxChanged(e)
	{
		var target = e.target;
		window.Canvas.SetText(target.value);
		window.Canvas.Draw();
	}

	function submitButtonClicked(e)
	{
		window.TextHandler.ReadText(window.Canvas.text);
		window.Canvas.Draw();
	}

	function fillOrStrokeChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFillOrStroke(target.value);
		window.Canvas.Draw();
	}

	function textSizeChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontSize(target.value);
		window.Canvas.Draw();
	}

	function textFillColorChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFillColor("#" + target.value);
		window.Canvas.Draw();
	}

	function textFontChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFont(target.value);
		window.Canvas.Draw();
	}

	function fontWeightChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontWeight(target.value);
		window.Canvas.Draw();
	}

	function fontStyleChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontStyle(target.value);
		window.Canvas.Draw();
	}
}