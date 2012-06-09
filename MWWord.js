function MWWord(word) 
{
	this.sWord = word;
	this.iCount = 1;
	this.sFont = "serif";
	this.sFillColor = "#ff0000";
	this.sFontWeight = "bold";
	this.sFontStyle = "normal";
	this.sFillOrStroke = "fill";
	
	this.IncreaseCount = function()
	{
		this.iCount++;
	};
	
	this.ChangeFillOrStroke = function(fillorstroke)
	{
		this.sFillOrStroke = fillorstroke;
	};
	
	this.ChangeFont = function(font)
	{
		this.sFontStyle = font;
	};
	
	this.ChangeFillColor = function(fillcolor)
	{
		this.sFillColor = fillcolor;
	};
	
	this.ChangeFontWeight = function(fontweight)
	{
		this.sFontWeight = fontweight;
	};
	
	this.ChangeFontStyle = function(fontstyle)
	{
		this.sFontStyle = fontstyle;
	};
	
	this.Draw = function(context, xPos, yPos)
	{
		context.font = this.sFontWeight + " " + 
						this.sFontStyle + " " + 
						this.iCount*10+ "px " +
						this.sFont;
		context.fillStyle = this.sFillColor;
		
		var bDown = false;
		var bUp = false;
		var bRight = true;
		var bLeft = false;
		
		var OldImageData = context.getImageData(0, 0, 800, 600);
		var iCount = 0;
		var iCurrentValue = 1;
		
		var textWidth = context.measureText(this.sWord).width;
		
		var bCanBeDrawn = false;
		while(!bCanBeDrawn)
		{
			context.fillText(this.sWord, xPos, yPos);
			
			
			var imageData = context.getImageData(xPos-textWidth/2, yPos-textWidth/2, textWidth, textWidth);
			var pixels = imageData.data;
			
			var bCollides = false;
			
			Debugger.log(pixels.length);
			for(var i = 0; i < pixels.length; i+=4)
			{
				if(pixels[i+3]/255 > 0.1)
				{
//					Debugger.log(pixels[i+3]/255);
					bCollides = true;
					break;
				}
			}
			
			if(bCollides)
			{
//				Debugger.log(this.sWord+" cannot be drawn - collides");
				context.putImageData(OldImageData, 0, 0);
				if(bRight)
				{
					xPos+=20;
					iCount++;
					if(iCount == iCurrentValue)
					{
						bRight = false;
						bDown = true;
						iCount = 0;
					}
					
//					Debugger.log("RIGHT");
				}
				else if(bDown)
				{
					yPos+=20;
					iCount++;
					if(iCount == iCurrentValue)
					{
						bDown = false;
						bLeft = true;
						iCount = 0;
						iCurrentValue++;
					}
//					Debugger.log("DOWN");
				}
				else if(bLeft)
				{
					xPos-=20;
					iCount++;
					if(iCount == iCurrentValue)
					{
						bLeft = false;
						bUp = true;
						iCount = 0;
					}
//					Debugger.log("LEFT");
				}
				else if(bUp)
				{
					yPos-=20;
					iCount++;
					if(iCount == iCurrentValue)
					{
						bUp = false;
						bRight = true;
						iCount = 0;
						iCurrentValue++;
					}
//					Debugger.log("UP");
				}
			}
			else
			{
				bCanBeDrawn = true;
			}
		}
	};	
}