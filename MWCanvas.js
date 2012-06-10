function MWCanvas(stage)
{
	this.stage = stage;
	this.layer = new Kinetic.Layer();
	this.stage.add(this.layer);
	
	this.sFillOrStroke = "fill";
	this.sFont = "serif";
	this.sBackgroundColor = "#ffffff";
	this.sFillColor1 = "#ff0000";
	this.sFillColor2 = "#00ff00";
	this.sFillColor3 = "#0000ff";
	this.sFillColor4 = "#ffff00";
	this.sFillColor5 = "#ff00ff";
	this.sFontWeight = "normal";
	this.sFontStyle = "normal";
	this.iTextRotation = 0;
	
	this.Draw = function()
	{
		
		/*context.globalAlpha = 1;
				
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
				aWordList[i].Draw(canvas, xPos, yPos);
		}
		
		//set alpha to 255
		var imageData = context.getImageData(0, 0, 800, 600);
		var pixels = imageData.data;
		
		for(var i = 0; i < pixels.length; i+=4)
		{
			pixels[i+3] *= 10;
		}
		
		context.putImageData(imageData, 0, 0);
		*/
		
		this.stage.reset();
		this.layer = new Kinetic.Layer();
		this.stage.add(this.layer);
		
		window.stage = this.stage;
		
		var aWordList = window.TextHandler.GetWordList();
		var aDrawnWords = new Array();
		
		for(var i = 0; i < aWordList.length; i++)
		{
			if(aWordList[i].iCount > 1)
			{
				aWordList[i].Draw(this.layer, stage.getWidth(), stage.getHeight(), aDrawnWords);
				aDrawnWords.push(aWordList[i]);
			}
		}
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
			switch(i%5)
			{
			case 0:
				aWordList[i].ChangeFillColor(this.sFillColor1);
				break;
			case 1:
				aWordList[i].ChangeFillColor(this.sFillColor2);
				break;
			case 2:
				aWordList[i].ChangeFillColor(this.sFillColor3);
				break;
			case 3:
				aWordList[i].ChangeFillColor(this.sFillColor4);
				break;
			case 4:
				aWordList[i].ChangeFillColor(this.sFillColor5);
				break;
			}
		}
	};
	
	this.SetFillOrStroke = function(fillOrStroke)
	{
		this.sFillOrStroke = fillOrStroke;
	};
	
	this.SetFillColor = function(id, fillcolor)
	{
		switch(id)
		{
		case 1:
			this.sFillColor1 = fillcolor;
			break;
		case 2:
			this.sFillColor2 = fillcolor;
			break;
		case 3:
			this.sFillColor3 = fillcolor;
			break;
		case 4:
			this.sFillColor4 = fillcolor;
			break;
		case 5:
			this.sFillColor5 = fillcolor;
			break;
		default:
			this.sFillColor1 = fillcolor;
			break;
		}
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