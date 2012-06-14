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

function UpdateFancyBox()
{
	Debugger.log("UPDATING FANCYBOX");
	//update fancybox
	window.stage.toDataURL(
		function(dataUrl){
			$('#saveButton2').fancybox({
				type: 'image',
				href : dataUrl,
				title: 'blabla'
		});}//, 
//		"image/jpeg",
//		1.0
	);
}