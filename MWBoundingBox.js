function MWBoundingBox(word)
{
	
	this.sName = word;
	this.pLT = new POINT(0,0);
	this.pRB = new POINT(0,0);
	this.pOffset = new POINT(0,0);
	
	this.LTPoint;
	this.RBPoint;
	
	this.bDrawn = false;
	
	this.setLT = function(x,y)
	{
		this.pLT.x = x;
		this.pLT.y = y;
	};
	
	this.setRB = function(x,y)
	{
		this.pRB.x = x;
		this.pRB.y = y;
	};
	
	this.getLTX = function()
	{
		return this.pLT.x + this.pOffset.x;
	};
	this.getLTY = function()
	{
		return this.pLT.y + this.pOffset.y;
	};
	this.getRBX = function()
	{
		return this.pRB.x + this.pOffset.x;
	};
	this.getRBY = function()
	{
		return this.pRB.y + this.pOffset.y;
	};
	
	this.setOffset = function(x,y)
	{
		this.pOffset.x = x;
		this.pOffset.y = y;
	};
	
	this.collidesWith = function(otherBB)
	{
		if(otherBB.getLTX() > this.getRBX() || 
				otherBB.getLTY() > this.getRBY() ||
				otherBB.getRBX() < this.getLTX() ||
				otherBB.getRBY() < this.getLTY())
			return false;
		else
		{
//			Debugger.log(this.sName+ "'s BB collides with "+otherBB.sName+"'s BB");
			return true;
		}
	};
	
	this.Draw = function()
	{
//		Debugger.log(this.sName+": DRAWING BOUNDING BOX");
		if(this.bDrawn)
		{
			window.selectionlayer.remove(this.LTPoint);
			window.selectionlayer.remove(this.RBPoint);
		}
		
		this.LTPoint = new Kinetic.Circle({
			name: this.sWord,
			x: this.pLT.x+this.pOffset.x,
			y: this.pLT.y+this.pOffset.y,
			radius: 5,
			fill: "blue",
			stroke: "black",
			strokeWidth: 1
		});
		
		this.RBPoint = new Kinetic.Circle({
			name: this.sWord,
			x: this.pRB.x+this.pOffset.x,
			y: this.pRB.y+this.pOffset.y,
			radius: 5,
			fill: "blue",
			stroke: "black",
			strokeWidth: 1
		});
		
		window.selectionlayer.add(this.LTPoint);
		window.selectionlayer.add(this.RBPoint);
		window.selectionlayer.draw();
		this.bDrawn = true;
	};
}