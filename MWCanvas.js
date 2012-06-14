function MWCanvas(stage)
{
	this.stage = stage;
	this.dummylayer = new Kinetic.Layer();
	this.textlayer = new Kinetic.Layer();
	this.selectionlayer = new Kinetic.Layer();
	
	this.stage.add(this.dummylayer);
	this.stage.add(this.textlayer);
	this.stage.add(this.selectionlayer);
	
	this.sFillOrStroke = "fill";
	this.sFont = "serif";
	this.sBackgroundColor = "#000000";
	this.sSelectionColor = "#ffffff";
	this.sFillColor1 = "#C20000";
	this.sFillColor2 = "#00AD00";
	this.sFillColor3 = "#00008C";
	this.sFillColor4 = "#737300";
	this.sFillColor5 = "#910091";
	this.sFontWeight = "normal";
	this.sFontStyle = "normal";
	this.iTextRotation = 0;
	
	this.aDrawnWords = new Array();
	this.aToDrawList = new Array();
	
	this.dummyrectangle;
	
	this.Draw = function()
	{
		
		this.stage.reset();
		this.dummylayer = new Kinetic.Layer();
		this.textlayer = new Kinetic.Layer();
		this.selectionlayer = new Kinetic.Layer();
		
		this.stage.add(this.dummylayer);
		this.stage.add(this.textlayer);
		this.stage.add(this.selectionlayer);
		
		this.DrawDummyRectangle();
		
		window.stage = this.stage;
		window.textlayer = this.textlayer;
		window.selectionlayer = this.selectionlayer;
		
		//set selected word to undefined
		window.TextHandler.SelectWord(undefined);
		
		this.UpdateWordStyles();
		
		this.aDrawnWords = new Array();
		this.aToDrawList = new Array();
		var aWordList = window.TextHandler.GetWordList();
		for(var i = 0; i < aWordList.length; i++)
		{
			if(aWordList[i].iCount > 1)
				this.aToDrawList.push(aWordList[i]);
		}
		
		
		this.dummylayer.on("mousedown", function(event){
			var aDrawnWords = window.Canvas.GetDrawnWordsList();
			var bIntersect = false;
			for(var i = 0; i < aDrawnWords.length; i++)
			{
				if(aDrawnWords[i].textShape.intersects(event.offsetX, event.offsetY))
				{
					bIntersect = true;
					break;
				}
			}
			if(!bIntersect)
			{
				var selectedWord = window.TextHandler.GetSelectedWord();
				if(selectedWord != undefined)
					selectedWord.Unselect();
				
				window.TextHandler.SelectWord(undefined);
				window.selectionlayer.draw();
				document.getElementById("changeDiv2").style.display = 'none';
			}
			
			UpdateFancyBox();
		});
		
		window.Canvas.DrawNextWord(0);
	};
	
	this.DrawNextWord = function(index)
	{
		this.aToDrawList[index].Draw(this.stage.getWidth(), this.stage.getHeight(), this.aDrawnWords);
		this.aDrawnWords.push(this.aToDrawList[index]);
		
		index++;
		if(index < this.aToDrawList.length)
		{
			setTimeout(function() {
				window.Canvas.DrawNextWord(index);
			}, 200);
		}
		else
		{
			document.getElementById("loadingDiv").style.display = 'none';
			document.getElementById("maniwordlecanvas").style.display = 'block';
			document.getElementById("changeDiv1").style.display = 'block';
			UpdateFancyBox();
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
	
	this.SetBackGroundColor = function(color)
	{
		this.sBackgroundColor = color;
		this.dummyrectangle.setFill(this.sBackgroundColor);
		this.dummylayer.draw();
		this.sSelectionColor = InverseColor(color);
		for(var i = 0; i < this.aDrawnWords.length; i++)
			this.aDrawnWords[i].UpdateSelectionColor(this.sSelectionColor);

		window.selectionlayer.draw();
		UpdateFancyBox();
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
	
	this.GetDrawnWordsList = function()
	{
		return this.aDrawnWords;
	};
	
	this.DrawDummyRectangle = function()
	{
		
		this.dummyrectangle = new Kinetic.Rect({
			x: 0,
			y: 0,
			fill: this.sBackgroundColor,
			width: 800,
			height: 600
		});
		this.dummylayer.add(this.dummyrectangle);
		this.dummylayer.draw();
	};
}