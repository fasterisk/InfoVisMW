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
	this.pPos = new POINT(0,0);
	this.iSpanWidth;
	this.aDrawnPoints = new Array();
	this.textShape;
	this.pStartBeginning = new POINT(0,0);
	this.pStartCurrent = new POINT(0,0);
	
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
	
	this.CreateDrawnPointArray = function()
	{
		this.aDrawnPoints = new Array();
		for(var y = this.pPos.y-this.iSpanWidth; y < this.pPos.y+this.iSpanWidth; y++)
		{
			for(var x = this.pPos.x-this.iSpanWidth; x < this.pPos.x+this.iSpanWidth; x++)
			{
				if(this.textShape.intersects(x,y))
					this.aDrawnPoints.push(new POINT(x,y));
			}
		}
	};
	
	this.Draw = function(layer, stageWidth, stageHeight, aDrawnWords)
	{
		Debugger.log("DRAWING: "+ this.sWord);
		
		//Initial drawing position
		this.pPos.x = stageWidth / 2;
		this.pPos.y = stageHeight / 2;
		
		
		
		//create textshape
		this.textShape = new Kinetic.Text({
			x: this.pPos.x,
			y: this.pPos.y,
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
		
		//rotate text according to the rotation
		this.textShape.setRotationDeg(this.iTextRotation);
		
		//add text to the layer (for being able to get parameters as width, height or intersects)
		layer.add(this.textShape);
		this.textShape.saveData();
		
		//get the maximum span width of the word
		this.iSpanWidth = Math.max(this.textShape.getTextWidth(), this.textShape.getTextHeight());
		
		
		//add eventlistener
		var thisword = this.sWord;
		this.textShape.on("dragstart", function() {
			var word = window.TextHandler.GetWord(thisword); 
			word.pStartCurrent.x = word.pPos.x;
			word.pStartCurrent.y = word.pPos.y;
		});
		
		this.textShape.on("dragmove", function() {
			document.body.style.cursor = "pointer";
			
			var word = window.TextHandler.GetWord(thisword); 
			word.textShape.saveData();

			layer.remove(word.textShape);
			
			var layerChildren = layer.getChildren();
			for(var i = 0; i < layerChildren.length; i++)
				layerChildren[i].setAlpha(0.5);
				
			layer.add(word.textShape);
			//layer.draw();
			
		});
		
		this.textShape.on("dragend", function() {
			
			var word = window.TextHandler.GetWord(thisword);
			word.textShape.saveData();
			word.pPos.x = word.textShape.getX();
			word.pPos.y = word.textShape.getY();
			
			
			layer.remove(word.textShape);
			
			var layerChildren = layer.getChildren();
			for(var i = 0; i < layerChildren.length; i++)
				layerChildren[i].setAlpha(1);
			
			var bReturnToOriginalPosition = false;
			for(var i = 0; i < word.aDrawnPoints.length; i++)
			{
				if(!bReturnToOriginalPosition)
				{
					var x = word.aDrawnPoints[i].x+word.pPos.x-word.pStartBeginning.x;
					var y = word.aDrawnPoints[i].y+word.pPos.y-word.pStartBeginning.y;

					for(var j = 0; j < layerChildren.length; j++)
					{
						if(layerChildren[j].intersects(x,y))
						{
							if(layerChildren[j].getFontSize() > word.textShape.getFontSize())
							{
								word.textShape.transitionTo({
									x: word.pStartCurrent.x,
									y: word.pStartCurrent.y,
									duration: 0.2,
									callback: function() {
										word.pPos.x = word.pStartCurrent.x;
										word.pPos.y = word.pStartCurrent.y;
										word.textShape.saveData();
									}
								});
								bReturnToOriginalPosition = true;
								break;
							}
						}
					}	
				}
			}
			document.body.style.cursor = "default";
			layer.add(word.textShape);
			layer.draw();
		});
		
		this.textShape.on("mouseover", function() {
			document.body.style.cursor = "pointer";
		});
		this.textShape.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
		
		//create an array that contains all drawn points of this word
		this.CreateDrawnPointArray();
		
		//only one of these can be true, it is the direction that the word has to move when a collision occurs
		var bDown = false;
		var bUp = false;
		var bRight = true;
		var bLeft = false;
		
		//how often the word was moved in one direction
		var iCount = 0;
		//how often the word has to be moved in one direction, before the direction has to be changed
		var iCurrentValue = 1;
		
		//debug
		var comparisons = 0;
		
		//true, as long no collision occurs
		var bCanBeDrawn = false;
		//true, when collision is detected
		var bCollisionDetected = false;
		while(!bCanBeDrawn)
		{
			//remove this shape to get only the children of the layer that need to be compared
			layer.remove(this.textShape);
			
			//get other children of this layer
			var layerChildren = layer.getChildren();
			
			//if current word is the first one, you can draw it directly
			if(layerChildren.length == 0)
			{
				layer.add(this.textShape);
				this.textShape.saveData();
				break;
			}
			
			bCollisionDetected = false;
			bCanBeDrawn = true;
			//go through all the points of the current text and look if it collides with a point at the layer
			for(var i = 0; i < this.aDrawnPoints.length; i++)
			{
				
				if(bCollisionDetected)
					break;

				//get current point
				var x = this.aDrawnPoints[i].x;
				var y = this.aDrawnPoints[i].y;
				
				//go through all children for collision detection
				for(var j = 0; j < layerChildren.length; j++)
				{
					comparisons++;
					//if collision is detected, move the current text by a certain amount
					if(layerChildren[j].intersects(x,y))// && this.textShape.intersects(x,y))
					{
						bCollisionDetected = true;
						bCanBeDrawn = false;
					
						var oldX = this.pPos.x;
						var oldY = this.pPos.y;
						if(bRight)
						{
							this.pPos.x+=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bRight = false;
								bDown = true;
								iCount = 0;
							}
//							Debugger.log("RIGHT");
						}
						else if(bDown)
						{
							this.pPos.y+=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bDown = false;
								bLeft = true;
								iCount = 0;
								iCurrentValue++;
							}
//							Debugger.log("DOWN");
						}
						else if(bLeft)
						{
							this.pPos.x-=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bLeft = false;
								bUp = true;
								iCount = 0;
							}
//							Debugger.log("LEFT");
						}
						else if(bUp)
						{
							this.pPos.y-=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bUp = false;
								bRight = true;
								iCount = 0;
								iCurrentValue++;
							}
//							Debugger.log("UP");
						}
				
						for(var k = 0; k < this.aDrawnPoints.length; k++)
						{
							this.aDrawnPoints[k].x += this.pPos.x-oldX;
							this.aDrawnPoints[k].y += this.pPos.y-oldY;
						}
				
						this.textShape.setX(this.pPos.x);
						this.textShape.setY(this.pPos.y);
				
//						Debugger.log("Collision Detected 1");
						break;
					}
				}
			}
					
//			Debugger.log("Can be drawn? "+bCanBeDrawn + " "+this.textShape.getX());
			//add the shape to the layer again
			layer.add(this.textShape);
			this.textShape.saveData();
		}
		Debugger.log("Comparisons: "+comparisons);
		
		this.pStartBeginning.x = this.pPos.x;
		this.pStartBeginning.y = this.pPos.y;
		
		//Draw the layer
		layer.draw();
	};	
}