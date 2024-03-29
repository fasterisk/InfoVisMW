window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded()
{
	//hide interface for second page
	document.getElementById("changeDiv1").style.display = 'none';
	document.getElementById("changeDiv2").style.display = 'none';
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
	
	//create stage
	if(window.stage == undefined)
	{
		window.stage = new Kinetic.Stage({
			container: "maniwordlecanvas",
			width: 800,
			height: 600
		});
		window.Canvas = new MWCanvas(stage);
	}
	
	//Add event listener for creation page
	var formElement = document.getElementById("textBox");
	formElement.addEventListener('keyup', textBoxChanged, false);

	formElement = document.getElementById("textSubmitButton");
	formElement.addEventListener('click', submitButtonClicked, false);

	formElement = document.getElementById("fillOrStroke");
	formElement.addEventListener('change', fillOrStrokeChanged, false);

	formElement = document.getElementById("backGroundColor");
	formElement.addEventListener('change', textFillColorChanged, false);
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
	formElement = document.getElementById("borderColor");
	formElement.addEventListener('change', textFillColorChanged, false);

	formElement = document.getElementById("textFont");
	formElement.addEventListener('change', textFontChanged, false);

	formElement = document.getElementById("fontStyle");
	formElement.addEventListener('change', fontStyleChanged, false);
	
	formElement = document.getElementById("textRotation");
	formElement.addEventListener('change', textRotationChanged, false);
	
	//Add eventlistener for second page
	formElement = document.getElementById("returnToCreate");
	formElement.addEventListener('click', returnButtonClicked_page2, false);
	
	formElement = document.getElementById("textFont_page2");
	formElement.addEventListener('change', textFontChanged_page2, false);
	
	formElement = document.getElementById("fontStyle_page2");
	formElement.addEventListener('change', fontStyleChanged_page2, false);
	
	formElement = document.getElementById("fillOrStroke_page2");
	formElement.addEventListener('change', fillOrStrokeChanged_page2, false);
	
	formElement = document.getElementById("backGroundColor_page2");
	formElement.addEventListener('change', textFillColorChanged_page2, false);
	formElement = document.getElementById("textFillColor_page2");
	formElement.addEventListener('change', textFillColorChanged_page2, false);
	formElement = document.getElementById("borderColor_page2");
	formElement.addEventListener('change', textFillColorChanged_page2, false);
	
	formElement = document.getElementById("pinCheckbox_page2");
	formElement.addEventListener('change', pinCheckboxChanged_page2, false);
	
	//Eventhandler for first page
	function textBoxChanged(e)
	{
		var target = e.target;
		window.CurrentText = target.value;
	}

	function submitButtonClicked(e)
	{
		window.TextHandler.ReadText(window.CurrentText);
		
		var aToDrawList = new Array();
		var aWordList = window.TextHandler.GetWordList();
		for(var i = 0; i < aWordList.length; i++)
		{
			if(aWordList[i].iCount > 1)
				aToDrawList.push(aWordList[i]);
		}
		
		if(aToDrawList.length == 0)
		{
			alert("Text is too short! Please enter longer text!");
			return;
		}
		
		document.getElementById("loadingDiv").style.display = 'block';
		document.getElementById("createDiv1").style.display = 'none';
		document.getElementById("createDiv2").style.display = 'none';
		
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

	function textFontChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFont(target.value);
	}

	function fontStyleChanged(e)
	{
		var target = e.target;
		window.Canvas.SetFontStyle(target.value);
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
		case "backGroundColor":
			window.Canvas.SetBackGroundColor("#" + target.value);
			break;
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
		case "borderColor":
			window.Canvas.SetFillColor(6, "#" + target.value);
			break;
		}
		
	}
	
	function textRotationChanged(e)
	{
		var target = e.target;
		window.Canvas.SetTextRotation(target.value);
	}
	
	/*
	 * event handler for second page
	 */
	function returnButtonClicked_page2(e)
	{
		document.getElementById("changeDiv1").style.display = 'none';
		document.getElementById("changeDiv2").style.display = 'none';
		document.getElementById("createDiv1").style.display = 'block';
		document.getElementById("createDiv2").style.display = 'block';
		document.getElementById("maniwordlecanvas").style.display = 'none';
	}
	
	function textFontChanged_page2(e)
	{
		var target = e.target;
		var word = window.TextHandler.GetSelectedWord();
		word.ChangeFont(target.value);
		word.UpdateDrawing(true);
	}

	function fontStyleChanged_page2(e)
	{
		var target = e.target;
		var word = window.TextHandler.GetSelectedWord();
		word.ChangeFontStyle(target.value);
		word.UpdateDrawing(true);
	}
	
	function fillOrStrokeChanged_page2(e)
	{
		var target = e.target;
		var word = window.TextHandler.GetSelectedWord();
		word.ChangeFillOrStroke(target.value);
		word.UpdateDrawing(true);
	}
	
	function textFillColorChanged_page2(e)
	{
		var target = e.target;
		var word = window.TextHandler.GetSelectedWord();
		switch(target.id)
		{
		case "backGroundColor_page2":
			window.Canvas.SetBackGroundColor("#" + target.value);
			break;
		case "textFillColor_page2":
			word.ChangeFillColor("#" + target.value);
			word.UpdateDrawing(false);
			break;
		case "borderColor_page2":
			word.ChangeBorderColor("#" + target.value);
			word.UpdateDrawing(false);
			break;
		}
	}
	
	function pinCheckboxChanged_page2(e)
	{
		var word = window.TextHandler.GetSelectedWord();
		word.UpdatePinState();
	};
}