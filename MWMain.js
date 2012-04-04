var knownWords = new Array();
knownWords.push("the");
knownWords.push("der");
knownWords.push("ein");
knownWords.push("eine");
// todo: erweitern

function ReadText(text)
{
	var wordlist = new Array();
	var countlist = new Array();
	Debugger.log("TEXT CHANGED");
	var currentPos = 0;
	var newWordStr = "";
	var wordInWordlist = false;
	var nextPos = text.indexOf(" ", currentPos);
	var enter = text.indexOf("/n", currentPos);
	if (enter != -1 && enter < currentPos)
	{
		nextPos = enter;
	}

	while (nextPos != -1)
	{
		newWordStr = text.substring(currentPos, nextPos);
		wordInWordlist = false;
		if (newWordStr.length > 2)
		{
			// Debugger.log(newWordStr);
			for ( var i = 0; i < wordlist.length; i++)
			{
				if (wordlist[i] == newWordStr)
				{
					Debugger.log("Increasing count of " + wordlist[i]);
					countlist[i]++;
					wordInWordlist = true;
				}
			}
			if (!wordInWordlist)
			{
				Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
				wordlist.push(newWordStr);
				countlist.push(1);
			}
		}

		currentPos = nextPos + 1;
		nextPos = text.indexOf(" ", currentPos);
		var enter = text.indexOf("/n", currentPos);
		if (enter != -1 && enter < currentPos)
		{
			nextPos = enter;
		}
	}
	newWordStr = text.substring(currentPos, text.length);

	if (newWordStr.length > 2)
	{
		wordInWordlist = false;
		// Debugger.log(newWordStr);
		for ( var i = 0; i < wordlist.length; i++)
		{
			if (wordlist[i] == newWordStr)
			{
				Debugger.log("Increasing count of " + wordlist[i]);
				countlist[i]++;
				wordInWordlist = true;
			}
		}
		if (!wordInWordlist)
		{
			Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
			wordlist.push(newWordStr);
			countlist.push(1);
		}
	}

	// Debugging
	for ( var i = 0; i < wordlist.length; i++)
	{
		Debugger.log(wordlist[i] + " " + countlist[i]);
	}
}