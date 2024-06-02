import { assert } from 'chai';
import { cleanerLinks } from "../src/sk/cleanerLinks.js";

describe('cleanerLinks', () => {
	it('should cleanup file', () => {
		var input, expected;
		input = '[[File:Janusz Steinhoff.jpg|thumb|{{center|Janusz Steinhoff}}]]';
		expected = '[[Plik:Janusz Steinhoff.jpg|mały|{{center|Janusz Steinhoff}}]]';
		assert.equal(cleanerLinks(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|thumb|right|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|skala=0.7|opcjonalny komentarz]]';
		assert.equal(cleanerLinks(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|right|thumb|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|skala=0.7|opcjonalny komentarz]]';
		assert.equal(cleanerLinks(input), expected);

		input = '[[Plik:SweetyViper (8864273175).jpg|thumb|left|skala=0.7|opcjonalny komentarz]]';
		expected = '[[Plik:SweetyViper (8864273175).jpg|mały|lewo|skala=0.7|opcjonalny komentarz]]';
		assert.equal(cleanerLinks(input), expected);
	});

});
