function MWWord(word) 
{
	this.sWord = word;
	this.iCount = 1;
	this.sFont = "serif";
	this.sFillColor = "#ff0000";
	this.sFontWeight = "normal";
	this.sFontStyle = "normal";
	
	this.IncreaseCount = function()
	{
		this.iCount++;
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
		var iMoveValue = 0;
		
		var bCanBeDrawn = false;
		while(!bCanBeDrawn)
		{
			context.fillText(this.sWord, xPos, yPos);
			var imageData = context.getImageData(0, 0, 800, 600);
			var pixels = imageData.data;
			
			var bCollides = false;
			
			for(var i = 0; i < pixels.length; i+=4)
			{
				if(pixels[i+3]/255 > 0.1)
				{
					Debugger.log(pixels[i+3]/255);
					bCollides = true;
					break;
				}
			}
			
			if(bCollides)
			{
				Debugger.log(this.sWord+" cannot be drawn - collides");
				context.putImageData(OldImageData, 0, 0);
				iMoveValue++;
				if(bRight)
				{
					xPos+=iMoveValue;
					bRight = false;
					bDown = true;
					Debugger.log("RIGHT");
				}
				else if(bDown)
				{
					yPos+=iMoveValue;
					bDown = false;
					bLeft = true;
					Debugger.log("DOWN");
				}
				else if(bLeft)
				{
					xPos-=iMoveValue;
					bLeft = false;
					bUp = true;
					Debugger.log("LEFT");
				}
				else if(bUp)
				{
					yPos-=iMoveValue;
					bUp = false;
					bRight = true;
					Debugger.log("UP");
				}
			}
			else
			{
				bCanBeDrawn = true;
			}
		}
	};	
}