function MWTextHandler()
{
	/* private members */
	this.aWordList = new Array();
	

	this.ReadText = function(text)
	{
		//remove . , " etc. from text
		text = text.replace(/\,/g, "");
		text = text.replace(/\./g, "");
		text = text.replace(/\"/g, "");
		text = text.replace(/\;/g, "");
		text = text.replace(/\:/g, "");
		text = text.replace(/\'/g, "");
		
		
		Debugger.log("TEXT CHANGED");
		var currentPos = 0;
		var newWordStr = "";
		var wordInWordlist = false;
		var wordInKnownList = false;
		var nextPos = text.indexOf(" ", currentPos);
		var enter = text.indexOf("/n", currentPos);
		if (enter != -1 && enter < currentPos)
		{
			nextPos = enter;
		}

		while (nextPos != -1)
		{
			newWordStr = text.substring(currentPos, nextPos).toLowerCase();
			wordInWordlist = false;
			wordInKnownList = IsWordInKnownList(newWordStr);

			if (newWordStr.length > 2 && !wordInKnownList)
			{
				// Debugger.log(newWordStr);
				for ( var i = 0; i < this.aWordList.length; i++)
				{
					if (this.aWordList[i].sWord == newWordStr)
					{
						Debugger.log("Increasing count of " + this.aWordList[i].sWord);
						this.aWordList[i].IncreaseCount();
						wordInWordlist = true;
					}
				}
				if (!wordInWordlist)
				{
					Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
					this.aWordList.push(new MWWord(newWordStr));
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
		newWordStr = text.substring(currentPos, text.length).toLowerCase();
		wordInKnownList = IsWordInKnownList(newWordStr);
		
		if (newWordStr.length > 2 && !wordInKnownList)
		{
			wordInWordlist = false;
			// Debugger.log(newWordStr);
			for ( var i = 0; i < this.aWordList.length; i++)
			{
				if (this.aWordList[i].sWord == newWordStr)
				{
					Debugger.log("Increasing count of " + this.aWordList[i].sWord);
					this.aWordList[i].IncreaseCount();
					wordInWordlist = true;
				}
			}
			if (!wordInWordlist)
			{
				Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
				this.aWordList.push(new MWWord(newWordStr));
			}
		}
		
		//Sort the wordlist according to the count of the words
		this.aWordList.sort(WordSort);

		// Debugging
		for ( var i = 0; i < this.aWordList.length; i++)
		{
			Debugger.log(this.aWordList[i].sWord + " " + this.aWordList[i].iCount);
		}
	};
	
	this.GetWordList = function()
	{
		return this.aWordList;
	};
};