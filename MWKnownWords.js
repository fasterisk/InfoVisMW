/**
 * This file contains a list of words that are ignored
 */


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
aKnownWords.push("will");
aKnownWords.push("has");
aKnownWords.push("die");
aKnownWords.push("ist");
aKnownWords.push("sie");
aKnownWords.push("diese");
aKnownWords.push("auch");
aKnownWords.push("für");
aKnownWords.push("aus");
aKnownWords.push("sich");
aKnownWords.push("den");
aKnownWords.push("wir");
aKnownWords.push("dass");
aKnownWords.push("bei");
aKnownWords.push("als");
aKnownWords.push("von");
aKnownWords.push("aber");
aKnownWords.push("jeder");
aKnownWords.push("nach");
aKnownWords.push("mit");
aKnownWords.push("per");
aKnownWords.push("nur");
aKnownWords.push("soll");
aKnownWords.push("zum");
aKnownWords.push("sein");
aKnownWords.push("dem");
aKnownWords.push("über");
aKnownWords.push("das");
aKnownWords.push("des");
aKnownWords.push("kann");
aKnownWords.push("nicht");
aKnownWords.push("einer");
aKnownWords.push("und");
aKnownWords.push("werden");
aKnownWords.push("wird");
aKnownWords.push("but");



var overall_comparisons = 0;

function IsWordInKnownList(word)
{
	for(var i = 0; i < aKnownWords.length; i++)
	{
		if(word == aKnownWords[i])
			return true;
	}
	return false;
}