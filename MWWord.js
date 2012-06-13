function POINT(x,y){
	this.x = x;
	this.y = y;
}

function DragStartFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	word.iOriginalRotation = word.iTextRotation;
	word.pStart.x = word.pPos.x;
	word.pStart.y = word.pPos.y;
}

function DragMoveFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	
	event.shape.saveData();
	
	//update position
	word.UpdatePosition(event.shape);
	word.UpdateSelectionShape();
	
	word.pDrawnPointsOffset.x = word.pPos.x - word.pDrawnPointsPosition.x;
	word.pDrawnPointsOffset.y = word.pPos.y - word.pDrawnPointsPosition.y;
	
	//set alpha of all other words to 0.5
	window.textlayer.remove(word.textShape);
	
	var layerChildren = window.textlayer.getChildren();
	for(var i = 0; i < layerChildren.length; i++)
		layerChildren[i].setAlpha(0.5);
	
	window.textlayer.add(word.textShape);
	window.textlayer.draw();
}

function DragEndFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	word.UpdatePosition(word.textShape);
	
	window.textlayer.remove(word.textShape);
	
	//set alpha of all other words to 1 again
	var layerChildren = window.textlayer.getChildren();
	for(var i = 0; i < layerChildren.length; i++)
		layerChildren[i].setAlpha(1);
	
	/*
	 * collision detection - when a bigger word is under the current drop position, current word is moved back again
	 *  - when no bigger word is under the current drop position, all smaller words have to move, current word is dropped
	 */
	var bReturnToOriginalPosition = false;
	var aWordsToMove = new Array();
	for(var i = 0; i < word.aDrawnPoints.length; i++)
	{
		if(!bReturnToOriginalPosition)
		{
			var x = word.aDrawnPoints[i].x+word.pDrawnPointsOffset.x;
			var y = word.aDrawnPoints[i].y+word.pDrawnPointsOffset.y;
			
			if(!word.textShape.intersects(x,y))
				Debugger.log("ERROR: Drawnpoint does not intersect word!");

			for(var j = 0; j < layerChildren.length; j++)
			{
				if(layerChildren[j].intersects(x,y))
				{
					Debugger.log("COLLISION of "+word.sWord+"with + " +layerChildren[j].getName());
					if(layerChildren[j].getFontSize() > word.textShape.getFontSize())
					{
						Debugger.log(-0.5*(word.iTextRotation-word.iOriginalRotation)*Math.PI/180);
						//move current word back, no other word is moved
						word.textShape.transitionTo({
							x: word.pStart.x,
							y: word.pStart.y,
							duration: 0.2,
							rotation: (word.iOriginalRotation)*Math.PI/180,
							callback: function() {
								word.pPos.x = word.pStart.x;
								word.pPos.y = word.pStart.y;
								word.pDrawnPointsOffset.x = word.pPos.x - word.pDrawnPointsPosition.x;
								word.pDrawnPointsOffset.y = word.pPos.y - word.pDrawnPointsPosition.y;
								word.textShape.saveData();
								word.UpdatePosition(word.textShape);
								word.Select();
								word.UpdateSelectionShape();
								word.CreateDrawnPointArray();
							}
						});
						word.ChangeRotation(word.iOriginalRotation);
						word.Unselect();
						window.selectionlayer.draw();
						bReturnToOriginalPosition = true;
						break;
					}
					else
					{
						//add smaller word to the ones that have to move - moving is done later
						var bWordAlreadyInWordsToMove = false;
						for(var k = 0; k < aWordsToMove.length; k++)
						{
							if(aWordsToMove[k].sWord == layerChildren[j].getText())
							{
								bWordAlreadyInWordsToMove = true;
								break;
							}
						}
						if(!bWordAlreadyInWordsToMove)
							aWordsToMove.push(window.TextHandler.GetWord(layerChildren[j].getText()));
					}
					
				}
			}	
		}
	}
	
	window.textlayer.add(word.textShape);
	
	//move all smaller words
	if(!bReturnToOriginalPosition)
	{
		for(var k = 0; k < aWordsToMove.length; k++)
		{
			Debugger.log("MOVING "+aWordsToMove[k].sWord);
			var currentWord = aWordsToMove[k];
			currentWord.MoveToNewPosition();
			
		}
	}
	
	document.body.style.cursor = "default";
	window.textlayer.draw();
}

function MWWord(word) 
{
	this.sWord = word;
	this.iCount = 1;
	
	this.textShape;
	
	this.sFont = "serif";
	this.sFillColor = "ff0000";
	this.sFontWeight = "bold";
	this.sFontStyle = "normal";
	this.sFillOrStroke = "fill";
	this.iTextRotation = 0;
	this.iOriginalRotation = 0;
	
	this.iSpanWidth;
	this.aDrawnPoints = new Array();
	
	this.pPos = new POINT(0,0);
	this.pStart = new POINT(0,0);
	this.pDrawnPointsOffset = new POINT(0,0);
	this.pDrawnPointsPosition = new POINT(0,0);
	
	this.bPinned = false;
	this.bSelected = false;
	
	this.selectionShapeRect;
	this.selectionShapeLine;
	this.selectionShapeRotationPoint;
	
	this.selectionShapeRotationPointStart = new POINT(0,0);
	
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
	
	this.ChangeRotation = function(rotation)
	{
		this.iTextRotation = rotation;
	};
	
	this.CreateDrawnPointArray = function()
	{
		Debugger.log("CALLING: CreateDrawnPointArray with pPos: ("+this.pPos.x + ","+this.pPos.y + ")");
		this.aDrawnPoints = new Array();
		for(var y = this.pPos.y-this.iSpanWidth; y < this.pPos.y+this.iSpanWidth; y+=2)
		{
			for(var x = this.pPos.x-this.iSpanWidth; x < this.pPos.x+this.iSpanWidth; x+=2)
			{
				if(this.textShape.intersects(x,y))
					this.aDrawnPoints.push(new POINT(x,y));
			}
		}
		
//		Debugger.log("DRAWNPOINTS: length: "+this.aDrawnPoints.length);
		this.pDrawnPointsPosition = new POINT(this.pPos.x, this.pPos.y);
		this.pDrawnPointsOffset = new POINT(0,0);
	};
	
	this.Unselect = function()
	{
		if(this.bSelected)
		{
			window.selectionlayer.remove(this.selectionShapeRect);
			window.selectionlayer.remove(this.selectionShapeLine);
			window.selectionlayer.remove(this.selectionShapeRotationPoint);
		}
		this.bSelected = false;
	};
	
	this.Select = function()
	{
		if(!this.bSelected)
		{
			window.selectionlayer.add(this.selectionShapeRect);
			window.selectionlayer.add(this.selectionShapeLine);
			window.selectionlayer.add(this.selectionShapeRotationPoint);
		}
		this.bSelected = true;
	};
	
	this.UpdatePosition = function(shape)
	{
		shape.saveData();
		this.pPos.x = shape.getX();
		this.pPos.y = shape.getY();
		this.textShape.setX(this.pPos.x);
		this.textShape.setY(this.pPos.y);
		this.textShape.setRotationDeg(this.iTextRotation);
		this.textShape.saveData();
		window.textlayer.draw();
	};
	
	this.UpdateSelectionShape = function()
	{
		var bBeforeSelected = this.bSelected;
		if(this.bSelected)
			this.Unselect();
		
		//create selection shape
		var selectionShapeRect = new Kinetic.Rect({
			name: this.sWord,
			x: this.pPos.x,
			y: this.pPos.y,
			width: this.textShape.getTextWidth(),
			height: this.textShape.getTextHeight(),
			stroke: "black",
			strokeWidth: 1,
			centerOffset: [this.textShape.getTextWidth()/2, this.textShape.getTextHeight()/2], //for rotation
			draggable: true
		});
		this.selectionShapeRect = selectionShapeRect;
		this.selectionShapeRect.on("dragstart", function(event) {
			DragStartFunction(event);
		});
		this.selectionShapeRect.on("dragmove", function(event) {
			DragMoveFunction(event);
		});
		this.selectionShapeRect.on("dragend", function(event) {
			DragEndFunction(event);
		});
		this.selectionShapeRect.on("mouseover", function(event) {
			document.body.style.cursor = "pointer";
		});
		this.selectionShapeRect.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
		
		var selectionShapeLine = new Kinetic.Line({
			name: this.sWord,
			points: [this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180), this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180),
			         this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180)+20*Math.sin(this.iTextRotation*Math.PI/180), this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180) - 20*Math.cos(this.iTextRotation*Math.PI/180)],
			stroke: "black",
			strokeWidth : 1,
			lineCap: "round",
			lineJoin: "round"
		});

		this.selectionShapeLine = selectionShapeLine;
		var selectionShapeRotationPoint = new Kinetic.Circle({
			name: this.sWord,
			x: this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180)+20*Math.sin(this.iTextRotation*Math.PI/180),
			y: this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180) - 20*Math.cos(this.iTextRotation*Math.PI/180),
			radius: 5,
			fill: "green",
			stroke: "black",
			strokeWidth: 1,
			draggable: true
		});
		this.selectionShapeRotationPoint = selectionShapeRotationPoint;
		
		//rotate the selection shape
		this.selectionShapeRect.setRotationDeg(this.iTextRotation);
		
		//add event handler for the rotation point
		this.selectionShapeRotationPoint.on("dragstart", function(event) {
			DragStartFunction(event);
			
		});
		this.selectionShapeRotationPoint.on("dragmove", function(event) {
			var word = window.TextHandler.GetWord(event.shape.getName());
			
			var vec1X = word.textShape.getTextHeight()/2*Math.sin(word.iTextRotation*Math.PI/180)+20*Math.sin(word.iTextRotation*Math.PI/180);
			var vec1Y = -word.textShape.getTextHeight()/2*Math.cos(word.iTextRotation*Math.PI/180) - 20*Math.cos(word.iTextRotation*Math.PI/180);
			var vec2X = event.shape.getX() - word.pPos.x;
			var vec2Y = event.shape.getY() - word.pPos.y;
			
			//calculate the new rotation angle
			var cosAngle = (vec1X * vec2X + vec1Y * vec2Y) / (Math.sqrt(vec1X*vec1X + vec1Y*vec1Y)*(Math.sqrt(vec2X*vec2X + vec2Y*vec2Y)));
			
			if(cosAngle > 1)
				 cosAngle = 1;
			
			var angle = Math.acos(cosAngle);
			
			if((vec1X*vec2Y - vec1Y*vec2X)<0)
				angle = -angle;

			word.ChangeRotation(word.iTextRotation+angle*180/Math.PI);
			word.UpdatePosition(word.textShape);
			word.UpdateSelectionShape();
			
			//set alpha of all other words to 0.5
			window.textlayer.remove(word.textShape);
			
			var layerChildren = window.textlayer.getChildren();
			for(var i = 0; i < layerChildren.length; i++)
				layerChildren[i].setAlpha(0.5);
			
			window.textlayer.add(word.textShape);
			window.textlayer.draw();
			
			word.selectionShapeRotationPoint.saveData();
		});
		
		this.selectionShapeRotationPoint.on("dragend", function(event){
			var word = window.TextHandler.GetWord(event.shape.getName());
			
			word.CreateDrawnPointArray();
			DragEndFunction(event);
		});
		this.selectionShapeRotationPoint.on("mouseover", function(event) {
			document.body.style.cursor = "pointer";
		});
		this.selectionShapeRotationPoint.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
		
		
		
		if(bBeforeSelected)
			this.Select();
		
		window.selectionlayer.draw();
	};
	
	this.MoveToNewPosition = function()
	{
		var pCurrentPos = new POINT(this.pPos.x, this.pPos.y);
		
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
			window.textlayer.remove(this.textShape);
			
			//get other children of this layer
			var layerChildren = window.textlayer.getChildren();
			
			//if current word is the first one, you can draw it directly
			if(layerChildren.length == 0)
			{
				window.textlayer.add(this.textShape);
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
				
				if(!this.textShape.intersects(x,y))
					Debugger.log("ERROR");
				
				//go through all children for collision detection
				for(var j = 0; j < layerChildren.length; j++)
				{
					comparisons++;
					//if collision is detected, move the current text by a certain amount
					if(layerChildren[j].intersects(x,y))// && this.textShape.intersects(x,y))
					{
						Debugger.log(pCurrentPos.x + " " + pCurrentPos.y);
						bCollisionDetected = true;
						bCanBeDrawn = false;
					
						var oldX = pCurrentPos.x;
						var oldY = pCurrentPos.y;
						if(bRight)
						{
							pCurrentPos.x+=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bRight = false;
								bDown = true;
								iCount = 0;
							}
							Debugger.log("RIGHT");
						}
						else if(bDown)
						{
							pCurrentPos.y+=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bDown = false;
								bLeft = true;
								iCount = 0;
								iCurrentValue++;
							}
							Debugger.log("DOWN");
						}
						else if(bLeft)
						{
							pCurrentPos.x-=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bLeft = false;
								bUp = true;
								iCount = 0;
							}
							Debugger.log("LEFT");
						}
						else if(bUp)
						{
							pCurrentPos.y-=20;
							iCount++;
							if(iCount == iCurrentValue)
							{
								bUp = false;
								bRight = true;
								iCount = 0;
								iCurrentValue++;
							}
							Debugger.log("UP");
						}
				
						for(var k = 0; k < this.aDrawnPoints.length; k++)
						{
							this.aDrawnPoints[k].x += pCurrentPos.x-oldX;
							this.aDrawnPoints[k].y += pCurrentPos.y-oldY;
						}
						
						this.textShape.setX(pCurrentPos.x);
						this.textShape.setY(pCurrentPos.y);
				
//						Debugger.log("Collision Detected 1");
						break;
					}
				}
			}
			
			
			
			//add the shape to the layer again
			window.textlayer.add(this.textShape);
			this.textShape.saveData();
		}
		
		this.pPos.x = pCurrentPos.x;
		this.pPos.y = pCurrentPos.y;
		
		/*this.textShape.transitionTo({
			x: pCurrentPos.x,
			y: pCurrentPos.y,
			duration: 0.2,
			callback: function() {
				Debugger.log("END TRANSITION");
				window.TextHandler.UpdateTextPositions();
			}
		});*/
		
		Debugger.log("Comparisons: "+comparisons);
		
		this.pStart.x = this.pPos.x;
		this.pStart.y = this.pPos.y;
		
		this.CreateDrawnPointArray();
		
		this.iOriginalRotation = this.iTextRotation;
		
		// update the selection shape - only shown when text is selected
		this.UpdateSelectionShape();
		
		window.textlayer.draw();
	};
	
	this.Draw = function(stageWidth, stageHeight, aDrawnWords)
	{
		Debugger.log("DRAWING: "+ this.sWord);
		
		//Initial drawing position
		this.pPos.x = stageWidth / 2;
		this.pPos.y = stageHeight / 2;
		
		//create textshape
		this.textShape = new Kinetic.Text({
			name: this.sWord,
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
		window.textlayer.add(this.textShape);
		this.textShape.saveData();
		
		
		
		//get the maximum span width of the word
		this.iSpanWidth = Math.max(this.textShape.getTextWidth(), this.textShape.getTextHeight());
		
		
		//add eventlistener
		this.textShape.on("dragstart", function(event) {
			DragStartFunction(event);
		});
		this.textShape.on("dragmove", function(event) {
			DragMoveFunction(event);
		});
		this.textShape.on("dragend", function(event) {
			DragEndFunction(event);
		});
		this.textShape.on("mouseover", function() {
			document.body.style.cursor = "pointer";
		});
		this.textShape.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
		this.textShape.on("mousedown", function(event) {
			var currentWord = window.TextHandler.GetWord(event.shape.getName());
			var selectedWord = window.TextHandler.GetSelectedWord();
			
			if(selectedWord != undefined)
				selectedWord.Unselect();

			window.TextHandler.SelectWord(currentWord);
			currentWord.Select();
			
			window.selectionlayer.draw();
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
			window.textlayer.remove(this.textShape);
			
			//get other children of this layer
			var layerChildren = window.textlayer.getChildren();
			
			//if current word is the first one, you can draw it directly
			if(layerChildren.length == 0)
			{
				window.textlayer.add(this.textShape);
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
					
			//add the shape to the layer again
			window.textlayer.add(this.textShape);
			this.textShape.saveData();
		}
		Debugger.log("Comparisons: "+comparisons);
		
		this.pStart.x = this.pPos.x;
		this.pStart.y = this.pPos.y;
		
		this.CreateDrawnPointArray();
		
		this.iOriginalRotation = this.iTextRotation;
		
		// update the selection shape - only shown when text is selected
		this.UpdateSelectionShape();
		
		//Draw the layer
		window.textlayer.draw();
	};	
}