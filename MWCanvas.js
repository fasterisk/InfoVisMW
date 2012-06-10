function MWCanvas(canvas)
{
	this.canvas = canvas;
	this.sFillOrStroke = "fill";
	this.sFont = "serif";
	this.sFillColor = "#ff0000";
	this.sFontWeight = "normal";
	this.sFontStyle = "normal";
	this.iTextRotation = 0;
	
	this.Draw = function()
	{
		var context = canvas.getContext("2d");
	
		context.globalAlpha = 1;
				
		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, canvas.width, canvas.height);
		
		//set alpha to 0
		var imageData = context.getImageData(0, 0, 800, 600);
		var pixels = imageData.data;
		for(var i = 0; i < pixels.length; i+=4)
			pixels[i+3] = 0;
		context.putImageData(imageData, 0, 0);
		
		context.globalAlpha = 0.1;
		
		// Text
		context.textBaseline = "middle";
		context.textAlign = "center";
		
		var xPos = (canvas.width / 2);
		var yPos = (canvas.height / 2);
		
		var aWordList = window.TextHandler.GetWordList();
		
		for(var i = 0; i < aWordList.length; i++)
		{
			if(aWordList[i].iCount > 1)
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
	
	this.UpdateWordStyles = function() 
	{
		var aWordList = window.TextHandler.GetWordList();
		for(var i = 0; i < aWordList.length; i++)
		{
			aWordList[i].ChangeFont(this.sFont);
			aWordList[i].ChangeFillOrStroke(this.sFillOrStroke);
			aWordList[i].ChangeFillColor(this.sFillColor);
			aWordList[i].ChangeFontWeight(this.sFontWeight);
			aWordList[i].ChangeFontStyle(this.sFontStyle);
			if(i%2 == 0)
				aWordList[i].ChangeRotation(this.iTextRotation);
			else
				aWordList[i].ChangeRotation(this.iTextRotation - 90);
		}
	};
	
	this.SetFillOrStroke = function(fillOrStroke)
	{
		this.sFillOrStroke = fillOrStroke;
	};
	
	this.SetFillColor = function(fillcolor)
	{
		this.sFillColor = fillcolor;
	};
	
	this.SetFont = function(font)
	{
		this.sFont = font;
	};
	
	this.SetFontWeight = function(fontweight)
	{
		this.sFontWeight = fontweight;
	};
	
	this.SetFontStyle = function(fontstyle)
	{
		this.sFontStyle = fontstyle;
	};
	
	this.SetTextRotation = function(rotation)
	{
		this.iTextRotation = rotation;
	};
}