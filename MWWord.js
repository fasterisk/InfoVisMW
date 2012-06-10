function POINT(x,y){
	this.x = x;
	this.y = y;
}


function MWWord(word) 
{
	this.sWord = word;
	this.iCount = 1;
	this.sFont = "serif";
	this.sFillColor = "ff0000";
	this.sFontWeight = "bold";
	this.sFontStyle = "normal";
	this.sFillOrStroke = "fill";
	this.iTextRotation = 0;
	this.textShape;
	
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
		//Debugger.log(fillcolor);
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
	
	this.ChangeRotation = function(rotation)
	{
		this.iTextRotation = rotation;
	};
	
	this.Draw = function(layer, stageWidth, stageHeight, aDrawnWords)
	{
		Debugger.log("DRAWING: "+ this.sWord);
		
		var xPos = stageWidth / 2;
		var yPos = stageHeight / 2;
		
		this.textShape = new Kinetic.Text({
			x: xPos,
			y: yPos,
			text: this.sWord,
			fontSize: this.iCount*10,
			fontFamily: this.sFont,
			textFill: this.sFillColor,
			align: "center",
			verticalAlign: "middle",
			fontStyle: this.sFontStyle,
			fontWeight: this.sFontWeight,
			draggable: true
		});
		
		this.textShape.setRotationDeg(90);
		
		this.textShape.on("dragmove", function() {
			this.textShape.saveData();
		});
		
		
		layer.add(this.textShape);
		this.textShape.saveData();
		
		var textWidth = this.textShape.getTextWidth();
		var textHeight = this.textShape.getTextHeight();
		var xPos = this.textShape.getX();
		var yPos = this.textShape.getY();
		
		var maxDist = Math.max(textWidth, textHeight);
		
		var points = new Array();
		for(var y = yPos-maxDist; y < yPos+maxDist; y++)
		{
			for(var x = xPos-maxDist; x < xPos+maxDist; x++)
			{
				if(this.textShape.intersects(x,y))
					points.push(new POINT(x,y));
			}
		}
		
		var comparisons = 0;
		var bCanBeDrawn = false;
		var bCollisionDetected = false;
		while(!bCanBeDrawn)
		{
			layer.remove(this.textShape);
			
			var layerChildren = layer.getChildren();
			
			if(layerChildren.length == 0)
			{
				layer.add(this.textShape);
				this.textShape.saveData();
				break;
			}
			
			bCollisionDetected = false;
			bCanBeDrawn = true;
			for(var i = 0; i < points.length; i++)
			{
				if(bCollisionDetected)
				{
//					Debugger.log("Collision Detected 2");
					break;
				}
				var x = points[i].x;
				var y = points[i].y;
				for(var j = 0; j < layerChildren.length; j++)
				{
					comparisons++;
					if(layerChildren[j].intersects(x,y) && this.textShape.intersects(x,y))
					{
						bCollisionDetected = true;
						bCanBeDrawn = false;
						xPos++;
						this.textShape.setX(xPos);
						for(var k = 0; k < points.length; k++)
						{
							points[k].x++;
						}
//						Debugger.log("Collision Detected 1");
						break;
					}
				}
			}
			
//			Debugger.log("Can be drawn? "+bCanBeDrawn + " "+this.textShape.getX());
			layer.add(this.textShape);
			this.textShape.saveData();
			//layer.draw();
			
			//setTimeout("ShowDelayMessage()",3000);
		}
		Debugger.log("Comparisons: "+comparisons);
		layer.draw();
		
		/*var context = canvas.getContext("2d");
		
		context.font = this.sFontWeight + " " + 
						this.sFontStyle + " " + 
						this.iCount*10+ "px " +
						this.sFont;
		context.fillStyle = this.sFillColor;
		context.strokeStyle = '#000000';
		context.textAlign = 'center';
		
		
		var bDown = false;
		var bUp = false;
		var bRight = true;
		var bLeft = false;
		
		var OldImageData = context.getImageData(0, 0, 800, 600);
		var iCount = 0;
		var iCurrentValue = 1;
		
		
		var bCanBeDrawn = false;
		while(!bCanBeDrawn)
		{
			context.translate(xPos, yPos);
			context.rotate(this.iTextRotation*Math.PI/180);
			
			switch(this.sFillOrStroke)
			{
			case "fill":
//				context.fillText(this.sWord, xPos, yPos);
				context.fillText(this.sWord, 0, 0);
				break;
			case "fill+stroke":
//				context.fillText(this.sWord, xPos, yPos);
				context.fillText(this.sWord, 0, 0);
//				context.strokeText(this.sWord, xPos, yPos);
				context.strokeText(this.sWord, 0, 0);
				break;
			default:
//				context.fillText(this.sWord, xPos, yPos);
				context.fillText(this.sWord, 0, 0);
				break;
			}
			
			context.rotate(-this.iTextRotation*Math.PI/180);
			context.translate(-xPos, -yPos);
			
			var textWidth = context.measureText(this.sWord).width;
			
			var imageData = context.getImageData(xPos-textWidth, yPos-textWidth, 2*textWidth, 2*textWidth);
			var pixels = imageData.data;
			
			var bCollides = false;
			
//			Debugger.log("Drawing Word: "+ this.sWord);
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
		}*/
		
	};	
}