function MWCanvas(canvas)
{
	this.canvas = canvas;
	
	this.Draw = function()
	{
		var context = canvas.getContext("2d");
	
		context.globalAlpha = 0.1;
		
		// Text
		context.textBaseline = "middle";
		context.textAlign = "center";
		
		var xPos = (canvas.width / 2);
		var yPos = (canvas.height / 2);
		
		var aWordList = window.TextHandler.GetWordList();
		
		for(var i = 0; i < aWordList.length; i++)
		{
			aWordList[i].Draw(context, xPos, yPos);
		}
		
		//set alpha to 255
		var imageData = context.getImageData(0, 0, 800, 600);
		var pixels = imageData.data;
		
		for(var i = 0; i < pixels.length; i+=4)
		{
			pixels[i+3] *= 10;
		}
		
		context.putImageData(imageData, 0, 0);
	};
	
	this.SetText = function(text)
	{
		this.text = text;
	};
	
	this.SetFillOrStroke = function(fillOrStroke)
	{
		this.fillOrStroke = fillOrStroke;
	};
	
	this.SetFontSize = function(fontsize)
	{
		this.fontSize = fontsize;
	};
	
	this.SetFillColor = function(fillcolor)
	{
		this.textFillColor = fillcolor;
	};
	
	this.SetFont = function(font)
	{
		this.font = font;
	};
	
	this.SetFontWeight = function(fontweight)
	{
		this.fontWeight = fontweight;
	};
	
	this.SetFontStyle = function(fontstyle)
	{
		this.fontStyle = fontstyle;
	};
}