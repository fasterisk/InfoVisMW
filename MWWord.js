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
	this.iPosX;
	this.iPosY;
	this.iSpanWidth;
	this.aDrawnPoints = new Array();
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
	
	GetDrawnPointArray = function(shape, posX, posY, spanwidth)
	{
		var aDrawnPoints = new Array();
		for(var y = posY-spanwidth; y < posY+spanwidth; y++)
		{
			for(var x = posX-spanwidth; x < posX+spanwidth; x++)
			{
				if(shape.intersects(x,y))
					aDrawnPoints.push(new POINT(x,y));
			}
		}
		return aDrawnPoints;
	};
	
	this.Draw = function(layer, stageWidth, stageHeight, aDrawnWords)
	{
		Debugger.log("DRAWING: "+ this.sWord);
		
		//Initial drawing position
		this.iPosX = stageWidth / 2;
		this.iPosY = stageHeight / 2;
		
		//create textshape
		var shape = new Kinetic.Text({
			x: this.iPosX,
			y: this.iPosY,
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
		shape.setRotationDeg(this.iTextRotation);
		
		//add text to the layer (for being able to get parameters as width, height or intersects)
		layer.add(shape);
		shape.saveData();
		
		//add eventlistener
		shape.on("dragmove", function() {
			shape.saveData();
			var aDrawnPoints = GetDrawnPointArray(shape, shape.getX(), shape.getY(), Math.max(shape.getTextWidth(), shape.getTextHeight()));
			layer.remove(shape);
			var layerChildren = layer.getChildren();
			for(var i = 0; i < layerChildren.length; i++)
			{
				layerChildren[i].setAlpha(0.5);
				
			}
			
			for(var i = 0; i < aDrawnPoints.length; i++)
			{
				var x = aDrawnPoints[i].x;
				var y = aDrawnPoints[i].y;
				for(var j = 0; j < layerChildren.length; j++)
				{
					if(layerChildren[j].intersects(x,y) && shape.intersects(x,y))
					{
						layerChildren[j].transitionTo({
				            x: 0,
				            y: 0,
				            rotation: Math.PI * 2,
				            alpha: 1,
				            strokeWidth: 6,
				            scale: {
				              x: 1.3,
				              y: 1.3
				            },
				            duration: 1,
				          });
					}
				}
			}
			layer.add(shape);
			layer.draw();
		});
		
		shape.on("dragend", function() {
			shape.saveData();
			
			var layerChildren = layer.getChildren();
			for(var i = 0; i < layerChildren.length; i++)
			{
				layerChildren[i].setAlpha(1);
			}
			layer.draw();
		});
		
		//get the maximum span width of the word
		this.iSpanWidth = Math.max(shape.getTextWidth(), shape.getTextHeight());
		
		//create an array that contains all drawn points of this word
		var aDrawnPoints = GetDrawnPointArray(shape, this.iPosX, this.iPosY, this.iSpanWidth);
		
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
			layer.remove(shape);
			
			//get other children of this layer
			var layerChildren = layer.getChildren();
			
			//if current word is the first one, you can draw it directly
			if(layerChildren.length == 0)
			{
				layer.add(shape);
				shape.saveData();
				break;
			}
			
			bCollisionDetected = false;
			bCanBeDrawn = true;
			//go through all the points of the current text and look if it collides with a point at the layer
			for(var i = 0; i < aDrawnPoints.length; i++)
			{
				if(bCollisionDetected)
				{
//					Debugger.log("Collision Detected 2");
					break;
				}
				//get current point
				var x = aDrawnPoints[i].x;
				var y = aDrawnPoints[i].y;
				
				//go through all children for collision detection
				for(var j = 0; j < layerChildren.length; j++)
				{
					comparisons++;
					//if collision is detected, move the current text by a certain amount
					if(layerChildren[j].intersects(x,y) && shape.intersects(x,y))
					{
						bCollisionDetected = true;
						bCanBeDrawn = false;
						
						var oldX = this.iPosX;
						var oldY = this.iPosY;
						if(bRight)
						{
							this.iPosX+=20;
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
							this.iPosY+=20;
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
							this.iPosX-=20;
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
							this.iPosY-=20;
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
						
						for(var k = 0; k < aDrawnPoints.length; k++)
						{
							aDrawnPoints[k].x += this.iPosX-oldX;
							aDrawnPoints[k].y += this.iPosY-oldY;
						}
						
						shape.setX(this.iPosX);
						shape.setY(this.iPosY);
						
//						Debugger.log("Collision Detected 1");
						break;
					}
				}
			}
			
			
//			Debugger.log("Can be drawn? "+bCanBeDrawn + " "+this.textShape.getX());
			//add the shape to the layer again
			layer.add(shape);
			shape.saveData();
		}
//		Debugger.log("Comparisons: "+comparisons);
		
		this.textShape = shape;
		
		//Draw the layer
		layer.draw();
	};	
}