function MWCanvas(canvas)
{
	this.canvas = canvas;
	
	this.text = "text";
	this.fillOrStroke = "fill";
	this.fontSize = "50";
	this.font = "serif";
	this.textFillColor = "#ff0000";
	this.fontWeight = "normal";
	this.fontStyle = "normal";

	this.Draw = function()
	{
		var context = canvas.getContext("2d");
		
		// Background
		context.fillStyle = '#ffffaa';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Box
		context.fillStyle = '#000000';
		context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

		// Text
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.font = this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px "
				+ this.font;

		var xPosition = (canvas.width / 2);
		var yPosition = (canvas.height / 2);

		switch (this.fillOrStroke)
		{
		case "fill":
			context.fillStyle = this.textFillColor;
			context.fillText(this.text, xPosition, yPosition);
			break;
		case "stroke":
			context.strokeStyle = this.textFillColor;
			context.strokeText(this.text, xPosition, yPosition);
			break;
		case "both":
			context.fillStyle = this.textFillColor;
			context.fillText(this.text, xPosition, yPosition);
			context.strokeStyle = "#000000";
			context.strokeText(this.text, xPosition, yPosition);
			break;
		}
	};
	
	this.SetText = function(text)
	{
		this.text = text;
	};
	
	this.SetFillOrStroke = function(fillOrStroke)
	{
		this.fillOrStroke = fillOrStroke;
	};
	
	this.SetFontSize = function(fontsize)
	{
		this.fontSize = fontsize;
	};
	
	this.SetFillColor = function(fillcolor)
	{
		this.textFillColor = fillcolor;
	};
	
	this.SetFont = function(font)
	{
		this.font = font;
	};
	
	this.SetFontWeight = function(fontweight)
	{
		this.fontWeight = fontweight;
	};
	
	this.SetFontStyle = function(fontstyle)
	{
		this.fontStyle = fontstyle;
	};
}