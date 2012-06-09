window.aKnownWords = new Array();
aKnownWords.push("the");
aKnownWords.push("der");
aKnownWords.push("ein");
aKnownWords.push("eine");
aKnownWords.push("you");
aKnownWords.push("can");
aKnownWords.push("are");
aKnownWords.push("most");
aKnownWords.push("used");
aKnownWords.push("set");
aKnownWords.push("some");
aKnownWords.push("e.g.");
aKnownWords.push("then");
aKnownWords.push("that");
aKnownWords.push("after");
aKnownWords.push("can't");
aKnownWords.push("want");
aKnownWords.push("for");
aKnownWords.push("your");
aKnownWords.push("other");
aKnownWords.push("have");
aKnownWords.push("use");
aKnownWords.push("uses");
aKnownWords.push("and");
aKnownWords.push("not");
aKnownWords.push("with");
aKnownWords.push("this");
aKnownWords.push("where");
aKnownWords.push("whole");
aKnownWords.push("than");
aKnownWords.push("new");
aKnownWords.push("one");
aKnownWords.push("should");
aKnownWords.push("through");
aKnownWords.push("any");
aKnownWords.push("its");
aKnownWords.push("more");
aKnownWords.push("cant");
aKnownWords.push("because");
aKnownWords.push("even");

function IsWordInKnownList(word)
{
	for(var i = 0; i < aKnownWords.length; i++)
	{
		if(word == aKnownWords[i])
			return true;
	}
	return false;
}