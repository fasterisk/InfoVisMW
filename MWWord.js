/**
 * A point structure
 * @param x
 * @param y
 * @returns
 */
function POINT(x,y){
	this.x = x;
	this.y = y;
}

/**
 * Eventhandler when a word gets dragged - stores some current positions that later may have to be restored
 * @param event
 */
function DragStartFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	
//	Debugger.log(word.sWord+": DRAG START FUNCTION");
	
	word.iOriginalRotation = word.iTextRotation;
	word.pStart.x = word.pPos.x;
	word.pStart.y = word.pPos.y;
}

/**
 * Eventhandler when a word is dragged - some offsets are calculated, all other words get new alpha values
 */
function DragMoveFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	
//	Debugger.log(word.sWord+": DRAG MOVE FUNCTION");
	
//	word.BoundingBox.Draw();
	
	event.shape.saveData();
	
	//update position
	word.UpdatePosition(event.shape);
	word.UpdateSelectionShape();
	
	word.pDrawnPointsOffset.x = word.pPos.x - word.pDrawnPointsPosition.x;
	word.pDrawnPointsOffset.y = word.pPos.y - word.pDrawnPointsPosition.y;
	word.BoundingBox.setOffset(word.pDrawnPointsOffset.x, word.pDrawnPointsOffset.y);
	
	//set alpha of all other words to 0.5
	window.textlayer.remove(word.textShape);
	
	var layerChildren = window.textlayer.getChildren();
	for(var i = 0; i < layerChildren.length; i++)
		layerChildren[i].setAlpha(0.5);
	
	window.textlayer.add(word.textShape);
	window.textlayer.draw();
}

/**
 * Eventhandler when a word is dropped - also called when rotation is ending
 * @param event
 */
function DragEndFunction(event)
{
	var word = window.TextHandler.GetWord(event.shape.getName());
	word.UpdatePosition(word.textShape);
	
//	Debugger.log(word.sWord+": DRAG END FUNCTION");
	
	if(word.iOriginalRotation != word.iTextRotation)
	{
//		Debugger.log(word.sWord+":UPDATE DRAWN POINT ARRAY because originalrotation != textrotation");
		word.CreateDrawnPointArray();
	}
	
	window.textlayer.remove(word.textShape);
	
	//set alpha of all other words to 1 again
	var layerChildren = window.textlayer.getChildren();
	for(var i = 0; i < layerChildren.length; i++)
		layerChildren[i].setAlpha(1);
	
	var aWordsToCompare = new Array();
	for(var i = 0; i < layerChildren.length; i++)
	{
		var comparingWord = window.TextHandler.GetWord(layerChildren[i].getName());
		if(word.BoundingBox.collidesWith(comparingWord.BoundingBox))
		{
			aWordsToCompare.push(comparingWord.textShape);
		}
	}
	
	if(aWordsToCompare.length == 0)
	{
//		Debugger.log(word.sWord+": NO WORDS TO COMPARE BECAUSE OF THE BOUNDING BOX");
		window.textlayer.add(word.textShape);
		word.textShape.saveData();
		document.body.style.cursor = "default";
		window.textlayer.draw();
		return;
	}
	else
	{
//		Debugger.log(word.sWord+": "+aWordsToCompare.length+" WORDS TO COMPARE BECAUSE OF THE BOUNDING BOX");
	}
	
	/*
	 * collision detection - when a bigger word is under the current drop position, current word is moved back again
	 *  - when no bigger word is under the current drop position, all smaller words have to move, current word is dropped
	 */
	var bReturnToOriginalPosition = false;
	var aWordsToMove = new Array();
	var aWordsAlreadyToMove = new Array();
	for(var i = 0; i < word.aDrawnPoints.length; i++)
	{
		if(!bReturnToOriginalPosition)
		{
			var x = word.aDrawnPoints[i].x+word.pDrawnPointsOffset.x;
			var y = word.aDrawnPoints[i].y+word.pDrawnPointsOffset.y;
			
			if(!word.textShape.intersects(x,y))
				Debugger.log("ERROR: Drawnpoint does not intersect word!");

			for(var j = 0; j < aWordsToCompare.length; j++)
			{
				if(aWordsAlreadyToMove.length < aWordsToCompare.length)
					aWordsAlreadyToMove.push(false);
				
				if(!aWordsAlreadyToMove[j] && aWordsToCompare[j].intersects(x,y))
				{
					var comparingWord = window.TextHandler.GetWord(aWordsToCompare[j].getName());
					if(comparingWord.bPinned || aWordsToCompare[j].getFontSize() > word.textShape.getFontSize())
					{
//						Debugger.log("COLLISION of "+word.sWord+"(smaller) with " +aWordsToCompare[j].getName() + "(bigger)");
						//move current word back, no other word is moved
						word.textShape.transitionTo({
							x: word.pStart.x,
							y: word.pStart.y,
							duration: 0.2,
							rotation: (word.iOriginalRotation)*Math.PI/180,
							callback: function() {
//								Debugger.log("CALLBACK of transition of "+word.sWord);
								word.pPos.x = word.pStart.x;
								word.pPos.y = word.pStart.y;
								word.pDrawnPointsOffset.x = word.pPos.x - word.pDrawnPointsPosition.x;
								word.pDrawnPointsOffset.y = word.pPos.y - word.pDrawnPointsPosition.y;
								word.textShape.saveData();
								word.textShape.setRotationDeg(word.iOriginalRotation);
								
								
								if(word.iOriginalRotation != word.iTextRotation)
								{
									word.iTextRotation = word.iOriginalRotation;
									word.CreateDrawnPointArray();
								}
								word.BoundingBox.setOffset(word.pDrawnPointsOffset.x, word.pDrawnPointsOffset.y);
//								word.BoundingBox.Draw();
								
								word.Select();
								word.UpdateSelectionShape();
								//word.ChangeRotation(word.iOriginalRotation);
								window.selectionlayer.draw();
							}
						});
						word.Unselect();
						window.selectionlayer.draw();
						bReturnToOriginalPosition = true;
						break;
					}
					else
					{
//						Debugger.log("COLLISION of "+word.sWord+"(bigger) with " +aWordsToCompare[j].getName()+"(smaller)");
						//add smaller word to the ones that have to move - moving is done later

						aWordsAlreadyToMove[j] = true;
						aWordsToMove.push(window.TextHandler.GetWord(aWordsToCompare[j].getText()));
					}
					
				}
			}	
		}
	}
	
//	word.BoundingBox.Draw();
	window.textlayer.add(word.textShape);
	
	//move all smaller words
	if(!bReturnToOriginalPosition)
	{
		if(word.iOriginalRotation != word.iTextRotation)
		{
			word.iOriginalRotation = word.iTextRotation;
			word.textShape.setRotationDeg(word.iOriginalRotation);
		}
		for(var k = 0; k < aWordsToMove.length; k++)
		{
//			Debugger.log("MOVING "+aWordsToMove[k].sWord);
			var currentWord = aWordsToMove[k];
			currentWord.MoveToNewPosition();
		}
	}
	
	document.body.style.cursor = "default";
	window.textlayer.draw();
	
}

/**
 * constructor
 * @param word
 * @returns
 */
function MWWord(word) 
{
	this.sWord = word;
	this.iCount = 1;
	
	this.textShape;
	
	this.sFont = "serif";
	this.sFillColor = "ff0000";
	this.sBordercolor = "000000";
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
	
	this.BoundingBox = new MWBoundingBox(word);
	
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
		this.sFont = font;
	};
	
	this.ChangeFillColor = function(fillcolor)
	{
		this.sFillColor = fillcolor;
	};
	
	this.ChangeFontStyle = function(fontstyle)
	{
		this.sFontStyle = fontstyle;
	};
	
	this.ChangeRotation = function(rotation)
	{
//		Debugger.log(this.sWord+": CHANGE ROTATION");
		this.iTextRotation = rotation;
	};
	
	this.UpdateSelectionColor = function(color)
	{
		this.selectionShapeRect.setStroke(color);
		this.selectionShapeLine.setStroke(color);
		this.selectionShapeRotationPoint.setStroke(color);
	};
	
	this.UpdatePinState = function(){
		this.bPinned = !this.bPinned;
	}
	
	this.ChangeBorderColor = function(color)
	{
		this.sBordercolor = color;
	};
	
	/**
	 * create the array of the pixels of this word - update the boundingbox
	 */
	this.CreateDrawnPointArray = function()
	{
//		Debugger.log(this.sWord+": CREATE DRAWN POINT ARRAY");
		this.aDrawnPoints = new Array();
		
		var pLT = new POINT(this.pPos.x, this.pPos.y);
		var pRB = new POINT(this.pPos.x, this.pPos.y);
		
		for(var y = this.pPos.y-this.iSpanWidth; y < this.pPos.y+this.iSpanWidth; y+=2)
		{
			for(var x = this.pPos.x-this.iSpanWidth; x < this.pPos.x+this.iSpanWidth; x+=2)
			{
				if(this.textShape.intersects(x,y))
				{
					if(x < pLT.x)
						pLT.x = x;
					if(x > pRB.x)
						pRB.x = x;
					if(y < pLT.y)
						pLT.y = y;
					if(y > pRB.y)
						pRB.y = y;
					this.aDrawnPoints.push(new POINT(x,y));
				}
			}
		}
		this.BoundingBox.setLT(pLT.x, pLT.y);
		this.BoundingBox.setRB(pRB.x, pRB.y);
		this.BoundingBox.setOffset(0,0);
		
//		Debugger.log(this.sWord+": DRAWNPOINTS: length: "+this.aDrawnPoints.length);
		this.pDrawnPointsPosition = new POINT(this.pPos.x, this.pPos.y);
		this.pDrawnPointsOffset = new POINT(0,0);
	};
	
	
	/**
	 * Unselect this word
	 */
	this.Unselect = function()
	{
//		Debugger.log(this.sWord+": UNSELECT");
		if(this.bSelected)
		{
			window.selectionlayer.remove(this.selectionShapeRect);
			window.selectionlayer.remove(this.selectionShapeLine);
			window.selectionlayer.remove(this.selectionShapeRotationPoint);
		}
		this.bSelected = false;
	};
	
	/**
	 * Select this word, this function is called when this word gets selected with a mouseclick
	 */
	this.Select = function()
	{
//		Debugger.log(this.sWord+": SELECT");
		
		//Set interface for changing this word visible - set all options to the values of this word
		document.getElementById("changeDiv2").style.display = 'block';
		
		var pinCheckboxElement = document.getElementById("pinCheckbox_page2");
		pinCheckboxElement.checked = this.bPinned;
		
		var textFontElement = document.getElementById("textFont_page2");
		switch(this.sFont){
		case "serif":
			textFontElement.selectedIndex = 0;
			break;
		case "sans-serif":
			textFontElement.selectedIndex = 1;
			break;
		case "cursive":
			textFontElement.selectedIndex = 2;
			break;
		case "fantasy":
			textFontElement.selectedIndex = 3;
			break;
		case "monospace":
			textFontElement.selectedIndex = 4;
			break;
		}
		
		var fontStyleElement = document.getElementById("fontStyle_page2");
		switch(this.sFontStyle){
		case "normal":
			fontStyleElement.selectedIndex = 0;
			break;
		case "italic":
			fontStyleElement.selectedIndex = 1;
			break;
		case "bold":
			fontStyleElement.selectedIndex = 2;
			break;
		}
		
		var fillOrStrokeElement = document.getElementById("fillOrStroke_page2");
		switch(this.sFillOrStroke){
		case "fill":
			fillOrStrokeElement.selectedIndex = 0;
			break;
		case "fill+stroke":
			fillOrStrokeElement.selectedIndex = 1;
			break;
		}
		
		document.getElementById('textFillColor_page2').color.fromString(this.sFillColor.substring(1, 7));
		document.getElementById('borderColor_page2').color.fromString(this.sBordercolor.substring(1, 7));
		
		
		if(!this.bSelected)
		{
			//add the selection shapes to the selectionlayer so that they are visible
			window.selectionlayer.add(this.selectionShapeRect);
			window.selectionlayer.add(this.selectionShapeLine);
			window.selectionlayer.add(this.selectionShapeRotationPoint);
		}
		this.bSelected = true;
	};
	
	/**
	 * Updates the position of this word (including its textshape-object)
	 */
	this.UpdatePosition = function(shape)
	{
//		Debugger.log(this.sWord+": UPDATE POSITION");
		shape.saveData();
		this.pPos.x = shape.getX();
		this.pPos.y = shape.getY();
		this.textShape.setX(this.pPos.x);
		this.textShape.setY(this.pPos.y);
		this.textShape.setRotationDeg(this.iTextRotation);
		this.textShape.saveData();
		window.textlayer.draw();
	};
	
	/**
	 * Updates the selection shape of this word - position, width, height, color and rotation
	 * Creates a Rectangle and a Rotationpoint and a line connecting them
	 */
	this.UpdateSelectionShape = function()
	{
//		Debugger.log(this.sWord+": UPDATE SELECTION SHAPE");
		
		var bBeforeSelected = this.bSelected;
		if(this.bSelected)
			this.Unselect();
		
		//create selection shape rect
		var selectionShapeRect = new Kinetic.Rect({
			name: this.sWord,
			x: this.pPos.x,
			y: this.pPos.y,
			width: this.textShape.getTextWidth(),
			height: this.textShape.getTextHeight(),
			stroke: window.Canvas.sSelectionColor,
			strokeWidth: 1,
			centerOffset: [this.textShape.getTextWidth()/2, this.textShape.getTextHeight()/2], //for rotation
			draggable: true
		});
		this.selectionShapeRect = selectionShapeRect;
		
		//add eventlistener to the selectionshaperect - the same as when dragging a word
		this.selectionShapeRect.on("dragstart", function(event) {
			DragStartFunction(event);
		});
		this.selectionShapeRect.on("dragmove", function(event) {
			DragMoveFunction(event);
		});
		this.selectionShapeRect.on("dragend", function(event) {
			DragEndFunction(event);
			UpdateFancyBox();
		});
		this.selectionShapeRect.on("mouseover", function(event) {
			document.body.style.cursor = "pointer";
		});
		this.selectionShapeRect.on("mouseout", function() {
			document.body.style.cursor = "default";
		});
		
		//create selection shape line
		var selectionShapeLine = new Kinetic.Line({
			name: this.sWord,
			points: [this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180), this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180),
			         this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180)+20*Math.sin(this.iTextRotation*Math.PI/180), this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180) - 20*Math.cos(this.iTextRotation*Math.PI/180)],
			stroke: window.Canvas.sSelectionColor,
			strokeWidth : 1,
			lineCap: "round",
			lineJoin: "round"
		});
		this.selectionShapeLine = selectionShapeLine;
		
		//create selection shape rotation point
		var selectionShapeRotationPoint = new Kinetic.Circle({
			name: this.sWord,
			x: this.pPos.x + this.textShape.getTextHeight()/2*Math.sin(this.iTextRotation*Math.PI/180)+20*Math.sin(this.iTextRotation*Math.PI/180),
			y: this.pPos.y - this.textShape.getTextHeight()/2*Math.cos(this.iTextRotation*Math.PI/180) - 20*Math.cos(this.iTextRotation*Math.PI/180),
			radius: 5,
			fill: "green",
			stroke: window.Canvas.sSelectionColor,
			strokeWidth: 1,
			draggable: true
		});
		this.selectionShapeRotationPoint = selectionShapeRotationPoint;
		
		//rotate the selection shape rect - the rotation of the other two are calculated at creation
		this.selectionShapeRect.setRotationDeg(this.iTextRotation);
		
		//add event handler for the rotation point
		this.selectionShapeRotationPoint.on("dragstart", function(event) {
			DragStartFunction(event);
			
		});
		this.selectionShapeRotationPoint.on("dragmove", function(event) {
			var word = window.TextHandler.GetWord(event.shape.getName());
			
//			Debugger.log(word.sWord+": DRAGMOVE ROTATION POINT");
			
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
			DragEndFunction(event);
			UpdateFancyBox();
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
	
	/**
	 * Searches for a new position for the current word
	 *  - because it is moved when a bigger word gets dropped at its position
	 *  - or at the creation of the word cloud
	 */
	this.MoveToNewPosition = function()
	{
//		Debugger.log(this.sWord+": MOVE TO NEW POSITION");
		
		var pCurrentPos = new POINT(this.pPos.x, this.pPos.y);
		this.pStart.x = this.pPos.x;
		this.pStart.y = this.pPos.y;
		
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
//				Debugger.log(this.sWord+"("+pCurrentPos.x+","+pCurrentPos.y+") : NO WORDS TO COMPARE BECAUSE CURRENTLY THERE EXISTS ONLY THIS WORD");
				window.textlayer.add(this.textShape);
				this.textShape.saveData();
				break;
			}
			
			//get an array of the words that need to be compared because of the collision of their bounding boxes
			var aWordsToCompare = new Array();
			for(var i = 0; i < layerChildren.length; i++)
			{
				var comparingWord = window.TextHandler.GetWord(layerChildren[i].getName());
				if(this.BoundingBox.collidesWith(comparingWord.BoundingBox))
				{
					aWordsToCompare.push(comparingWord.textShape);
				}
			}
			
			if(aWordsToCompare.length == 0)
			{
//				Debugger.log(this.sWord+"("+pCurrentPos.x+","+pCurrentPos.y+") : NO WORDS TO COMPARE BECAUSE OF THE BOUNDING BOX");
				window.textlayer.add(this.textShape);
				this.textShape.saveData();
				break;
			}
			else
			{
//				Debugger.log(this.sWord+"("+pCurrentPos.x+","+pCurrentPos.y+") : "+ aWordsToCompare.length+" WORDS TO COMPARE BECAUSE OF THE BOUNDING BOX");
			}
			
			bCollisionDetected = false;
			bCanBeDrawn = true;
			//go through all the pixels of the current text and look if it collides with a pixel at the layer
			for(var i = 0; i < this.aDrawnPoints.length; i++)
			{
				
				if(bCollisionDetected)
					break;

				//get current pixel
				var x = this.aDrawnPoints[i].x;
				var y = this.aDrawnPoints[i].y;
				
				if(!this.textShape.intersects(x,y))
					Debugger.log(this.sWord+"("+pCurrentPos.x+","+pCurrentPos.y+") : ERROR");
				
				//go through all children for collision detection
				for(var j = 0; j < aWordsToCompare.length; j++)
				{
					overall_comparisons++;
					comparisons++;
					//if collision is detected, move the current text by a certain amount
					if(aWordsToCompare[j].intersects(x,y))
					{
//						Debugger.log(pCurrentPos.x + " " + pCurrentPos.y);
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
//							Debugger.log("RIGHT");
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
//							Debugger.log("DOWN");
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
//							Debugger.log("LEFT");
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
//							Debugger.log("UP");
						}
				
						for(var k = 0; k < this.aDrawnPoints.length; k++)
						{
							this.aDrawnPoints[k].x += pCurrentPos.x-oldX;
							this.aDrawnPoints[k].y += pCurrentPos.y-oldY;
						}
						this.BoundingBox.pLT.x += pCurrentPos.x-oldX;
						this.BoundingBox.pLT.y += pCurrentPos.y-oldY;
						this.BoundingBox.pRB.x += pCurrentPos.x-oldX;
						this.BoundingBox.pRB.y += pCurrentPos.y-oldY;
						
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
		
		//update position of the word and its drawnpoints and the bounding box
		this.pPos.x = pCurrentPos.x;
		this.pPos.y = pCurrentPos.y;
		
		this.pDrawnPointsPosition.x = this.pPos.x;
		this.pDrawnPointsPosition.y = this.pPos.y;
		this.pDrawnPointsOffset.x = 0;
		this.pDrawnPointsOffset.y = 0;
		this.BoundingBox.setOffset(0, 0);
		
		//move the shape back to the startposition and make a nice transition to the new position
		this.textShape.setX(this.pStart.x);
		this.textShape.setY(this.pStart.y);

		this.textShape.transitionTo({
			x: this.pPos.x,
			y: this.pPos.y,
			duration: 0.2,
			callback: function(){
				UpdateFancyBox();
			}
		});
		
		//DEBUG
//		this.BoundingBox.Draw();
		
//		Debugger.log(this.sWord+": PIXEL COMPARISONS: "+comparisons);
		
		this.pStart.x = this.pPos.x;
		this.pStart.y = this.pPos.y;
		
		this.iOriginalRotation = this.iTextRotation;
		
		// update the selection shape - only shown when text is selected
		this.UpdateSelectionShape();
		
		window.textlayer.draw();
	};
	
	/**
	 * Draws this word
	 * Only called at creation of the word cloud
	 */
	this.Draw = function(stageWidth, stageHeight, aDrawnWords)
	{
//		Debugger.log(this.sWord+": DRAWING");
		
		//Initial drawing position
		this.pPos.x = stageWidth / 2;
		this.pPos.y = stageHeight / 2;
		
		//create textshape
		if(this.sFillOrStroke == "fill")
		{
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
				draggable: true
			});
		}
		else
		{
			this.textShape = new Kinetic.Text({
				name: this.sWord,
				x: this.pPos.x,
				y: this.pPos.y,
				text: this.sWord,
				fontSize: this.iCount*10,
				fontFamily: this.sFont,
				textFill: this.sFillColor,
				textStroke: this.sBordercolor,
				textStrokeWidth: 1,
				align: "center",
				verticalAlign: "middle",
				fontStyle: this.sFontStyle,
				draggable: true
			});
		}
		
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
			UpdateFancyBox();
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

		//Move the word to a valid position
		this.MoveToNewPosition();
		
	};
	
	/**
	 * Updates the drawing of the word - no change in position, only in its parameters like color etc.
	 */
	this.UpdateDrawing = function(updatedrawnpointsarray)
	{
		window.textlayer.remove(this.textShape);
		
		//create textshape with actual parameters
		if(this.sFillOrStroke == "fill")
		{
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
				draggable: true
			});
		}
		else
		{
			this.textShape = new Kinetic.Text({
				name: this.sWord,
				x: this.pPos.x,
				y: this.pPos.y,
				text: this.sWord,
				fontSize: this.iCount*10,
				fontFamily: this.sFont,
				textFill: this.sFillColor,
				textStroke: this.sBordercolor,
				textStrokeWidth: 1,
				align: "center",
				verticalAlign: "middle",
				fontStyle: this.sFontStyle,
				draggable: true
			});
		}
		
		//rotate text according to the rotation
		this.textShape.setRotationDeg(this.iTextRotation);
		
		window.textlayer.add(this.textShape);
		this.textShape.saveData();
		
		//add eventlistener again
		this.textShape.on("dragstart", function(event) {
			DragStartFunction(event);
		});
		this.textShape.on("dragmove", function(event) {
			DragMoveFunction(event);
		});
		this.textShape.on("dragend", function(event) {
			DragEndFunction(event);
			UpdateFancyBox();
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
		
		//create the drawn point array again if the shape of the text is changed
		if(updatedrawnpointsarray)
		{
			this.CreateDrawnPointArray();
			
			var event = new Event();
			event.shape = this.textShape;
			DragStartFunction(event);
			DragMoveFunction(event);
			DragEndFunction(event);
			this.UpdateSelectionShape();
		}
		
		window.textlayer.draw();
	};
}