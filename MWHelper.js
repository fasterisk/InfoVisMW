function canvasSupport()
{
	return Modernizr.canvas;
}

var Debugger = function()
{
};
Debugger.log = function(message)
{
	try
	{
		console.log(message);
	}
	catch (exception)
	{
		return;
	}
};

var WordSort = function(word1, word2)
{
	return word2.iCount - word1.iCount;
};

function ShowDelayMessage()
{
	Debugger.log("DELAY");
};