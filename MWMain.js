window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded()
{
	window.TextHandler = new MWTextHandler();
	window.TextHandler.ReadText("Wordle is a tool in which you can generate tag clouds. " +
			"Tag clouds are built using the most used words of a user supplied text. " +
			"In Wordle you can set some input parameters e.g. color, alignment or size. " +
			"Then it generates a tag cloud (including some random parameters) using " +
			"the user defined text. However, the limitation of Wordle lies in the fact " +
			"that after the generation you can't change the parameters easily. If you " +
			"want to change parameters, for example other colors for your tag cloud, " +
			"you have to regenerate the entire tag cloud. Because of the random " +
			"parameters that Wordle uses, the tag cloud differs even though user " +
			"set parameters and text are the same. In order not to lose the entire " +
			"tag cloud configuration, another option for changing parameters is that " +
			"you export the cloud and change it with Photoshop or another image " +
			"manipulation program. This approach is not really user friendly. " +
			"A user would want to change the size and alignment of the cloud and " +
			"the words in realtime, without the need to regenerate the whole tag " +
			"cloud. This is where ManiWordle fits in. The basic idea is to adopt " +
			"the idea of Wordle and expand it with the missing possibilities of " +
			"changing the parameters or to change the alignment of the words " +
			"individually. This provides more user control over the basic Wordle " +
			"layout. As starting point ManiWordle uses a similar approach as the " +
			"tag cloud generation in Wordle. After that there are some basic " +
			"principles that control its behaviour. The first principle is that " +
			"bigger words are more important to ManiWordle in case the user wants " +
			"to position a single word. If he repositions a word with a bigger " +
			"font size (because it appears more often as other words in the text), " +
			"it has a higher priority and so words that are smaller than the current " +
			"one have to move to another position if they lie at the new position " +
			"of the bigger one. On the other side, you can't move a small word to " +
			"the position of the bigger word, because the bigger word's position is " +
			"more important. Another principle is that a user can pin a word to fix " +
			"its position. The pinned word is not allowed to move, even if you want " +
			"to place a bigger word at its place. The last feature that should be " +
			"provided is that the changes should be visible through animations. Every " +
			"time a word is moved, rotated or translated in any other manner the " +
			"changes apply smoothly with a nice animation so the user can easily " +
			"follow the changes he made.");
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