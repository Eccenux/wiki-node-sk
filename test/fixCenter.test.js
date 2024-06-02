import { assert } from 'chai';
import { fixes } from '../src/fixCenter.js';

describe('fixes', () => {
	it('should replace closed <center> tags with {{center| }}', () => {
		var input, expected;
		input = '[[Plik:Janusz Steinhoff.jpg|mały|<center>Janusz Steinhoff</center>]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Janusz Steinhoff}}]]';
		assert.equal(fixes(input), expected);
	});

	it('should replace unclosed <center> tags within [[ ]] with {{center| }}', () => {
		var input, expected;
		input = '[[Plik:Colcoca01.jpg|mały|<center>Krzew koki]]';
		expected = '[[Plik:Colcoca01.jpg|mały|{{center|Krzew koki}}]]';
		assert.equal(fixes(input), expected);
		input = '[[Plik:Janusz Steinhoff.jpg|mały|<center>Janusz Steinhoff<center/>]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Krzew koki}}]]';
		
	});

	it('should cleanup file', () => {
		var input, expected;
		input = '[[File:Janusz Steinhoff.jpg|thumb|<center>Janusz Steinhoff</center>]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Janusz Steinhoff}}]]';
		assert.equal(fixes(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|thumb|right|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|skala=0.7|opcjonalny komentarz]]';
		assert.equal(fixes(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|right|thumb|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|skala=0.7|opcjonalny komentarz]]';
		assert.equal(fixes(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|thumb|left|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|lewo|skala=0.7|opcjonalny komentarz]]';
		assert.equal(fixes(input), expected);
	});

});
