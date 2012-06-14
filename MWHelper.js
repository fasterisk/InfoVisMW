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
			$('#saveButton').fancybox({
				type: 'image',
				href : dataUrl,
				title: 'blabla'
		});}//, 
//		"image/jpeg",
//		1.0
	);
}

function InverseColor(color)
{
	var r = parseInt(color.substring(1, 3), 16);
	var g = parseInt(color.substring(3, 5), 16);
	var b = parseInt(color.substring(5, 7), 16);

	var rInverse = 255-r;
	var gInverse = 255-g;
	var bInverse = 255-b;

	return '#' + ValueToHex(rInverse) + ValueToHex(gInverse) + ValueToHex(bInverse);
}

function ValueToHex(hexvalue)
{
	var value = parseInt(hexvalue, 10);
	value = Math.max(0, Math.min(value, 255));
	return "0123456789ABCDEF".charAt((value - value % 16) / 16)
			+ "0123456789ABCDEF".charAt(value % 16);
}