


var terminalContainer = {};

terminalContainer.currentSlide					= undefined;
terminalContainer.currentSlideOriginalContent 	= undefined;
terminalContainer.currentOutput					= undefined;

terminalContainer.timer 						= undefined;
terminalContainer.preElementsToShow				= undefined;
terminalContainer.currentPreElementRemainder	= undefined;

$("#showTerminal").bind('deck.becameCurrent', function(ev,  element)
{
	{
		clearTerminalTimer();
		
		if( terminalContainer.currentSlide )
		{
			terminalContainer.currentSlide.innerHTML = terminalContainer.currentSlideContent;
		}
		
		terminalContainer.currentSlide 			= this;
		terminalContainer.currentSlideContent 	= this.innerHTML;
		
		terminalContainer.preElementsToShow = new Array;

		var preElements = this.getElementsByTagName("pre");
		var c			= preElements.length;
		
		for( var i=0 ; i<c ; i++ )
		{
			var text = preElements[i].innerHTML;
			
			if( text )
			{
				terminalContainer.preElementsToShow.push(preElements[i]);
			}
		}
		
		terminalContainer.currentSlide.innerHTML				='<pre></pre>';
		terminalContainer.currentOutput							= preElements[0];
		terminalContainer.currentOutput.style.color				="#0B0";
		terminalContainer.currentOutput.style.backgroundColor	="black";
		terminalContainer.timer									= setTimeout("showNextPreElement()",1000);
	}
});

$("#showTerminal").bind('deck.lostCurrent', function(ev,  element)
{
	if( terminalContainer.currentSlide )
	{
		terminalContainer.currentSlide.innerHTML = terminalContainer.currentSlideContent;
		terminalContainer.currentSlide = undefined;
	}
});

function clearTerminalTimer()
{
	if( terminalContainer.timer )
	{
		clearTimeout(terminalContainer.timer);
		terminalContainer.timer = undefined;
		return 1;
	}
	return 0;
}

function showNextPreElement()
{	
	if( !clearTerminalTimer() ) { ; }

	var terminalInput = terminalContainer.preElementsToShow.shift();
	
	terminalInput.innerHTML = terminalInput.innerHTML.replace(/^[\s\n]+|[\s\n]+$/g,'')
	
	if( "input" == terminalInput.getAttribute("id") )
	{
		terminalContainer.currentPreElementRemainder 	= "pt#" + terminalInput.innerHTML;
		terminalContainer.currentOutput.innerHTML		+= '_';
		terminalContainer.typeTimer						= setTimeout("terminalShowNextKeystroke()",150);
		return;
	}
	else
	{
		terminalContainer.currentOutput.innerHTML 		+= "\n" + terminalInput.innerHTML +"\n";	
	}
	
	if( terminalContainer.preElementsToShow.length > 0 )
	{
		terminalContainer.timer=setTimeout("showNextPreElement()",1000);
	}
}


function terminalShowNextKeystroke()
{
	if( !clearTerminalTimer() ) { ; }

	if( terminalContainer.currentPreElementRemainder.length > 0 )
	{
		if( '_' == terminalContainer.currentOutput.innerHTML.slice(-1) )
		{
			terminalContainer.currentOutput.innerHTML = terminalContainer.currentOutput.innerHTML.slice(0,-1) + terminalContainer.currentPreElementRemainder.charAt(0) ;
		}
		terminalContainer.currentPreElementRemainder = terminalContainer.currentPreElementRemainder.slice(1);

		if( terminalContainer.currentPreElementRemainder.length > 0 )
		{	
			terminalContainer.currentOutput.innerHTML += "_";
		}
		terminalContainer.timer		= setTimeout("terminalShowNextKeystroke()",150);
	}
	else
	{
		terminalContainer.timer		= setTimeout("showNextPreElement()",1000);
	}
}