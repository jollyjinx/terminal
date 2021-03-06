(function($, deck, undefined) {
   $(document).bind('deck.change', function(e, from, to) {
      var $prev = $[deck]('getSlide', to-1),
      $next = $[deck]('getSlide', to+1),
      $oldprev = $[deck]('getSlide', from-1),
      $oldnext = $[deck]('getSlide', from+1);
      
      var direction = "forward";
      if(from > to){
        direction = "reverse";
      }

      $[deck]('getSlide', to).trigger('deck.becameCurrent', $[deck]('getSlide', to) );
      $[deck]('getSlide', from).trigger('deck.lostCurrent', direction);

      $prev && $prev.trigger('deck.becamePrevious', direction);
      $next && $next.trigger('deck.becameNext', direction);

      $oldprev && $oldprev.trigger('deck.lostPrevious', direction);
      $oldnext && $oldnext.trigger('deck.lostNext', direction);
   });
})(jQuery, 'deck');




var terminalContainer = {};

terminalContainer.currentSlide					= undefined;
terminalContainer.currentSlideOriginalContent 	= undefined;
terminalContainer.currentOutput					= undefined;

terminalContainer.timer 						= undefined;
terminalContainer.preElementsToShow				= undefined;
terminalContainer.currentPreElementRemainder	= undefined;

$(".showTerminal").bind('deck.becameCurrent', function(ev,  element)
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
		
		terminalContainer.currentSlide.innerHTML				='<div class="terminal"><pre id="input"></pre></div>';
		terminalContainer.currentOutput							= preElements[0];
		terminalContainer.timer									= setTimeout("showNextPreElement()",1);
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
		terminalContainer.currentPreElementRemainder 	= terminalInput.innerHTML+"\n";
		terminalContainer.currentOutput.innerHTML		+= 'pt# _';
		terminalContainer.typeTimer						= setTimeout("terminalShowNextKeystroke()",1000);
		return;
	}
	else
	{
		terminalContainer.currentOutput.innerHTML 		+= terminalInput.innerHTML+"\n";	
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
			terminalContainer.currentOutput.innerHTML = terminalContainer.currentOutput.innerHTML.slice(0,-1);
		}
		
		
		var chartotype 									= terminalContainer.currentPreElementRemainder.charAt(0);
		terminalContainer.currentPreElementRemainder	= terminalContainer.currentPreElementRemainder.slice(1);
		
		if( '&' == chartotype )
		{
			var nextchar;
			do
			{
				nextchar										= terminalContainer.currentPreElementRemainder.charAt(0);
				terminalContainer.currentPreElementRemainder	= terminalContainer.currentPreElementRemainder.slice(1);
				chartotype += nextchar;
			}
			while( nextchar != ';' );
		}
		
		
		
		terminalContainer.currentOutput.innerHTML 		= terminalContainer.currentOutput.innerHTML+chartotype

		if( terminalContainer.currentPreElementRemainder.length > 0 )
		{	
			terminalContainer.currentOutput.innerHTML += "_";
		}
		terminalContainer.timer		= setTimeout("terminalShowNextKeystroke()",150);
	}
	else
	{
		terminalContainer.timer		= setTimeout("showNextPreElement()",500);
	}
}