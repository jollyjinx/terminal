Terminal / Command line - Simulation for deck.js
================================================

This is a module for the HTML Presentation framework deck.js ( https://github.com/imakewebthings/deck.js/wiki ).

You can use it to simulate you typing into a terminal and seeing the results in your presentation. You specify the input and output for each Terminal command and it will show the input as it was typed and the output shortly after.

Example syntax:
<pre>
	&lt;section class="slide"&gt;
	&lt;div id="showTerminal" class="slide"&gt;
		&lt;pre id="input"&gt;
		ls -la
		&lt;/pre&gt;
		&lt;pre id="output" &gt;total 296
		-rw-r--r--  1 jolly  wheel  15090  3 Oct 21:27 GPL-license.txt
		-rw-r--r--  1 jolly  wheel   1095  3 Oct 21:27 MIT-license.txt
		&lt;/pre&gt;
	&lt;/div&gt;
	&lt;/section&gt;
</pre>

Install it by copying it into the deck.js extensions folder and reference it in your presentation like this:
	<script src="deckjspath/extensions/terminal/deck.terminal.js"></script>


It is not finished. 
