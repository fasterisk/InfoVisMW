/**
 * reads the text and stores a wordlist
 * - also stores the currently selected word
 * @returns
 */

function MWTextHandler()
{
	/* private members */
	this.aWordList = new Array();
	this.selectedWord = undefined;
	
	this.SelectWord = function(selectedword)
	{
		this.selectedWord = selectedword;
	};
	
	this.GetSelectedWord = function()
	{
		return this.selectedWord;
	};

	this.GetWord = function(wordname)
	{
		for(var i = 0; i < this.aWordList.length; i++)
		{
			if(this.aWordList[i].sWord == wordname)
			{
				return this.aWordList[i];
			}
		}
	};
	
	this.UpdateTextPositions = function()
	{
		for(var i = 0; i < this.aWordList.length; i++)
			this.aWordList[i].UpdatePosition(this.aWordList[i].textShape);
	};

	this.ReadText = function(text)
	{
		//remove . , " etc. from text
		text = text.replace(/\,/g, "");
		text = text.replace(/\./g, "");
		text = text.replace(/\"/g, "");
		text = text.replace(/\;/g, "");
		text = text.replace(/\:/g, "");
		text = text.replace(/\'/g, "");
		text = text.replace(/\(/g, "");
		text = text.replace(/\)/g, "");
		
		this.aWordList = new Array();
		
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
		
		var tempWordList = new Array();

		while (nextPos != -1)
		{
			newWordStr = text.substring(currentPos, nextPos).toLowerCase();
			wordInWordlist = false;
			wordInKnownList = IsWordInKnownList(newWordStr);

			if (newWordStr.length > 2 && !wordInKnownList)
			{
				// Debugger.log(newWordStr);
				for ( var i = 0; i < tempWordList.length; i++)
				{
					if (tempWordList[i].sWord == newWordStr)
					{
						Debugger.log("Increasing count of " + tempWordList[i].sWord);
						tempWordList[i].IncreaseCount();
						wordInWordlist = true;
					}
				}
				if (!wordInWordlist)
				{
					Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
					tempWordList.push(new MWWord(newWordStr));
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
			for ( var i = 0; i < tempWordList.length; i++)
			{
				if (tempWordList[i].sWord == newWordStr)
				{
					Debugger.log("Increasing count of " + tempWordList[i].sWord);
					tempWordList[i].IncreaseCount();
					wordInWordlist = true;
				}
			}
			if (!wordInWordlist)
			{
				Debugger.log("Adding Word: " + newWordStr + " to Wordlist.");
				tempWordList.push(new MWWord(newWordStr));
			}
		}
		
		//Sort the wordlist according to the count of the words
		tempWordList.sort(WordSort);

		var maxSize = 0;
		for(var i = 0; i < tempWordList.length; i++)
			if(tempWordList[i].iCount > maxSize)
				maxSize = tempWordList[i].iCount;

		//for(var i = 0; i < tempWordList.length; i++)
			//tempWordList[i].iCount *= (tempWordList[i].iCount / maxSize);
		
		for ( var i = 0; i < tempWordList.length; i++)
		{
			Debugger.log(tempWordList[i].sWord + " " + tempWordList[i].iCount);
			if(tempWordList[i].iCount >= 2)
				this.aWordList.push(tempWordList[i]);
		}
	};
	
	this.GetWordList = function()
	{
		return this.aWordList;
	};
};