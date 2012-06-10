window.addEventListener('load', eventWindowLoaded, false);

function writeMessage(messageLayer, message) {
	Debugger.log(message);
    var context = messageLayer.getContext();
    messageLayer.clear();
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 25);
    
  }

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
	
	window.stage = new Kinetic.Stage({
		container: "container",
		width: 800,
		height: 600
	});
	
	window.Canvas = new MWCanvas(stage);
	
	//Add event listener
	var formElement = document.getElementById("textBox");
	formElement.addEventListener('keyup', textBoxChanged, false);

	formElement = document.getElementById("textSubmitButton");
	formElement.addEventListener('click', submitButtonClicked, false);

	formElement = document.getElementById("fillOrStroke");
	formElement.addEventListener('change', fillOrStrokeChanged, false);

	formElement = document.getElementById("textFillColor1");
	formElement.addEventListener('change', textFillColorChanged, false);
	formElement = document.getElementById("textFillColor2");
	formElement.addEventListener('change', textFillColorChanged, false);
	formElement = document.getElementById("textFillColor3");
	formElement.addEventListener('change', textFillColorChanged, false);
	formElement = document.getElementById("textFillColor4");
	formElement.addEventListener('change', textFillColorChanged, false);
	formElement = document.getElementById("textFillColor5");
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
		switch(target.id)
		{
		case "textFillColor1":
			window.Canvas.SetFillColor(1, "#" + target.value);
			break;
		case "textFillColor2":
			window.Canvas.SetFillColor(2, "#" + target.value);
			break;
		case "textFillColor3":
			window.Canvas.SetFillColor(3, "#" + target.value);
			break;
		case "textFillColor4":
			window.Canvas.SetFillColor(4, "#" + target.value);
			break;
		case "textFillColor5":
			window.Canvas.SetFillColor(5, "#" + target.value);
			break;
		}
		
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