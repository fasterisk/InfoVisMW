var knownWords = new Array();
knownWords.push("the");
knownWords.push("der");
knownWords.push("ein");
knownWords.push("eine");
// todo: erweitern


function MWTextHandler()
{
	/* private members */
	this.aWordList = new Array();
	

	this.ReadText = function(text)
	{
		aWordList = new Array();
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
				for ( var i = 0; i < aWordList.length; i++)
				{
					if (aWordList[i].sWord == newWordStr)
					{
						Debugger.log("Increasing count of " + aWordList[i].sWord);
						aWordList[i].IncreaseCount();
						wordInWordlist = true;
					}
				}
				if (!wordInWordlist)
				{
					Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
					aWordList.push(new MWWord(newWordStr));
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
			for ( var i = 0; i < aWordList.length; i++)
			{
				if (aWordList[i].sWord == newWordStr)
				{
					Debugger.log("Increasing count of " + aWordList[i].sWord);
					aWordList[i].IncreaseCount();
					wordInWordlist = true;
				}
			}
			if (!wordInWordlist)
			{
				Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
				aWordList.push(new MWWord(newWordStr));
			}
		}

		// Debugging
		for ( var i = 0; i < aWordList.length; i++)
		{
			Debugger.log(aWordList[i].sWord + " " + aWordList[i].iCount);
		}
	};
	
	this.GetWordList = function()
	{
		return aWordList;
	}
};