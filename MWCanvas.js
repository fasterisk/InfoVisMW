function MWCanvas(stage)
{
	this.stage = stage;
	this.textlayer = new Kinetic.Layer();
	this.selectionlayer = new Kinetic.Layer();
	
	this.stage.add(this.textlayer);
	this.stage.add(this.selectionlayer);
	
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
		
		this.stage.reset();
		this.textlayer = new Kinetic.Layer();
		this.selectionlayer = new Kinetic.Layer();
		
		this.stage.add(this.textlayer);
		this.stage.add(this.selectionlayer);
		
		window.stage = this.stage;
		window.textlayer = this.textlayer;
		window.selectionlayer = this.selectionlayer;
		
		//set selected word to undefined
		window.TextHandler.SelectWord(undefined);
		
		this.UpdateWordStyles();
		
		var aDrawnWords = new Array();
		var aWordList = window.TextHandler.GetWordList();
		for(var i = 0; i < aWordList.length; i++)
		{
			if(aWordList[i].iCount > 1)
			{
				aWordList[i].Draw(stage.getWidth(), stage.getHeight(), aDrawnWords);
				aDrawnWords.push(aWordList[i]);
			}
		}
		
		window.selectionlayer.draw();
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
		this.iTextRotation = parseInt(rotation);
	};
}