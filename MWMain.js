window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded()
{
	//hide interface for second page
	document.getElementById("changeDiv").style.display = 'none';
	document.getElementById("maniwordlecanvas").style.display = 'none';
	document.getElementById("loadingDiv").style.display = 'none';
	
	window.TextHandler = new MWTextHandler();
	window.CurrentText = "maniwordle maniwordle maniwordle maniwordle maniwordle wordle wordle wordle";
	window.TextHandler.ReadText(window.CurrentText);
	MainApp();
}

function MainApp()
{
	if (!canvasSupport())
	{
		return;
	}
	
	//Add event listener for creation page
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
	
	//Add eventlistener for changing page
	formElement = document.getElementById("returnToCreate");
	formElement.addEventListener('click', returnButtonClicked, false);
	
	
	function textBoxChanged(e)
	{
		var target = e.target;
		window.CurrentText = target.value;
	}

	function submitButtonClicked(e)
	{
		document.getElementById("loadingDiv").style.display = 'block';
		document.getElementById("createDiv").style.display = 'none';
		window.TextHandler.ReadText(window.CurrentText);
		if(window.stage == undefined)
		{
			window.stage = new Kinetic.Stage({
				container: "maniwordlecanvas",
				width: 800,
				height: 600
			});
			window.Canvas = new MWCanvas(stage);
		}
		
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
	
	
	function returnButtonClicked(e)
	{
		document.getElementById("changeDiv").style.display = 'none';
		document.getElementById("createDiv").style.display = 'block';
		document.getElementById("maniwordlecanvas").style.display = 'none';
	}
	
}